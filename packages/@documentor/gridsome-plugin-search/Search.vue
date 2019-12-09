<template>
  <div class="search">
    <input
      v-model="query"
      class="search_input"
      type="text"
      placeholder="Search"
    >

    {{ results }}

    <div
      v-if="error"
      class="error"
    >
      {{ error.message }}: {{ error.status }} - {{ error.statusText }}
    </div>
  </div>
</template>

<script>
import { SEARCH_SUGGESTIONS_PATH, SEARCH_INDEX_PATH } from './lib/constants'

let index
let suggestions

export default {
  name: 'Search',
  data: () => ({
    query: '',
    options: {},
    error: null,
  }),
  computed: {
    queryMetadata () {
      const isAdvancedSearch = this.query.search(/[*~^]/) !== -1
      const isFuzzy = this.query.search(/~/) !== -1
      const hasEditDistance = this.query.search(/~\d+$/) !== -1

      return {
        isAdvancedSearch,
        isFuzzy,
        hasEditDistance,
      }
    },
    queryValidation () {
      const { isAdvancedSearch, isFuzzy, hasEditDistance } = this.queryMetadata
      let message = null
      if (isAdvancedSearch && isFuzzy && !hasEditDistance) {
        message = {
          type: 'error',
          message: 'Edit distance must be numeric',
        }
      }

      return message
    },
    results () {
      if (this.query.length < 1) {
        return []
      }

      const { isAdvancedSearch, isFuzzy, hasEditDistance } = this.queryMetadata
      const results = []

      if ((isAdvancedSearch && !isFuzzy) || (isAdvancedSearch && hasEditDistance)) {
        index && results.push(...index.search(this.query))
      }

      return results
    },
  },
  beforeMount () {
    Promise.all([
      this.$axios
        .request({
          url: SEARCH_INDEX_PATH,
          baseURL: '/',
        }),
      this.$axios
        .request({
          url: SEARCH_SUGGESTIONS_PATH,
          baseURL: '/',
        }),
    ])
      .then(responseList => {
        index = this.$lunr.Index.load(responseList[0].data)
        suggestions = responseList[1].data
        console.log(index, suggestions)
      })
      .catch((error) => {
        const message = new DOMParser()
          .parseFromString(error.request.responseText, 'text/html')
          .body.innerText.trim()
        this.error = {
          message,
          status: error.response.status,
          statusText: error.response.statusText,
        }
      })
  },
}
</script>

<style scoped>

</style>
