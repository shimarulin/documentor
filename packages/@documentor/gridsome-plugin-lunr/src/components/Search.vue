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

    <!--    {{ results }}-->

    <ul v-if="results.length > 0">
      <li
        v-for="result in results"
        :key="result"
      >
        <ul>
          <li
            v-for="entry in result.entries"
            :key="entry"
          >
            <g-link :to="entry.path">
              <span v-html="entry.heading"/>
            </g-link>

            <ul>
              <li
                v-for="context in entry.contextList"
                :key="context"
              >
                <div v-html="context"/>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<static-query>
  {
    allDocumentation {
      edges {
        node {
          id
          headings {
            anchor
            depth
            value
          }
        }
      }
    }
  }
</static-query>

<script>
import clone from 'ramda/src/clone'
import { DOCUMENT_LIST_PATH, SEARCH_INDEX_PATH } from '../../lib/constants'
import Search from '../Search'

let index

const getQueryMetadata = (query) => {
  const isAdvancedSearch = query.search(/[*~^]/) !== -1
  const isFuzzy = query.search(/~/) !== -1
  const hasEditDistance = query.search(/~\d+$/) !== -1

  return {
    isAdvancedSearch,
    isFuzzy,
    hasEditDistance,
  }
}

export default {
  name: 'Search',
  data: () => ({
    query: '',
    error: null,
  }),
  computed: {
    queryValidation () {
      const { isAdvancedSearch, isFuzzy, hasEditDistance } = getQueryMetadata(this.query)
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
    results () {
      return this.query.length > 0 && index ? index.search(this.query) : []
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
        index = new Search(responseList[0].data, responseList[1].data.map(doc => {
          return {
            ...doc,
            ...clone(this.$static.allDocumentation.edges.find(entry => entry.node.id === doc.id).node),
          }
        }))
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
