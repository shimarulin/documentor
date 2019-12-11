<template>
  <div class="search">
    <input
      v-model="query"
      class="search_input"
      type="text"
      placeholder="Search"
    >
    <div
      v-if="queryValidation"
      :class="queryValidation.type"
    >
      {{ queryValidation.message }}
    </div>

    <div
      v-if="error"
      class="error"
    >
      {{ error.message }}: {{ error.status }} - {{ error.statusText }}
    </div>

    <ul v-if="contextResultList.result.length > 0">
      <li
        v-for="result in contextResultList.result"
        :key="result.ref"
      >
        <g-link :to="result.matchData.document.path">
          {{ result.matchData.document.title }}
        </g-link>

        <ul>
          <li
            v-for="context in result.matchData.contextList"
            :key="context.term + ': ' + context.text"
          >
            <h3 v-html="context.heading"/>

            <div v-html="context.text"/>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { DOCUMENT_LIST_PATH, SEARCH_INDEX_PATH } from '../../lib/constants'
import Search from '../Search'

let index

export default {
  name: 'Search',
  data: () => ({
    query: '',
    error: null,
  }),
  computed: {
    queryValidation () {
      const { isAdvancedSearch, isFuzzy, hasEditDistance } = this.contextResultList.queryMetadata
      let message = null
      if (isAdvancedSearch && isFuzzy && !hasEditDistance) {
        message = {
          type: 'error',
          // TODO: add i18n
          message: 'Edit distance must be numeric',
        }
      }

      return message
    },

    /**
     * Search result
     * @typedef {Object} SearchResult
     * @property {string} ref - Reference ID.
     * @property {number} score - The result score.
     * @property {Object} matchData - The result data.
     * */

    /**
     * Get results for search
     * @returns {SearchResult[]} - context metadata
     */
    contextResultList () {
      return this.query.length > 0 && index ? index.search(this.query) : {
        queryMetadata: {},
        resultList: [],
      }
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
          url: DOCUMENT_LIST_PATH,
          baseURL: '/',
        }),
    ])
      .then(responseList => {
        index = new Search(responseList[0].data, responseList[1].data)
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
