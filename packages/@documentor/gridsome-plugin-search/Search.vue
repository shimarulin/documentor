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
    queryValidation: null,
    results: [],
    options: {},
    error: null,
  }),
  watch: {
    query (nextQuery) {
      this.getResults(nextQuery)
    },
  },
  // computed: {
  //   result () {
  //     if (this.query.length < 1) {
  //       return []
  //     }
  //
  //     const results = []
  //
  //     const isAdvancedSearch = this.query.search(/[*~^]/) !== -1
  //     const isFuzzy = this.query.search(/~/) !== -1
  //     const hasEditDistance = this.query.search(/~\d+$/) !== -1
  //
  //     if ((isAdvancedSearch && !isFuzzy) || (isAdvancedSearch && hasEditDistance)) {
  //       index && results.push(...index.search(this.query))
  //     } else if (isAdvancedSearch && isFuzzy && !hasEditDistance) {
  //       console.error('Edit distance must be numeric')
  //       this.queryValidation = {
  //         type: 'error',
  //         message: 'Edit distance must be numeric',
  //       }
  //     }
  //
  //     return results
  //   },
  // },
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
  methods: {
    getResults (query) {
      if (query.length < 1) {
        this.results = []
        return
      }

      const results = []
      this.queryValidation = null

      const isAdvancedSearch = query.search(/[*~^]/) !== -1
      const isFuzzy = query.search(/~/) !== -1
      const hasEditDistance = query.search(/~\d+$/) !== -1

      if ((isAdvancedSearch && !isFuzzy) || (isAdvancedSearch && hasEditDistance)) {
        index && results.push(...index.search(query))
      } else if (isAdvancedSearch && isFuzzy && !hasEditDistance) {
        this.queryValidation = {
          type: 'error',
          message: 'Edit distance must be numeric',
        }
      }

      this.results = results
    },
  },
}
</script>

<style scoped>

</style>
