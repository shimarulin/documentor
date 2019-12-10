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

    <ul v-if="contextResultList.length > 0">
      <li
        v-for="result in contextResultList"
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
import { DOCUMENT_LIST_PATH, SEARCH_INDEX_PATH } from './lib/constants'
import { wrapTerm, truncateTermContext } from './src/getContext'

let index
let documentList

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
          // TODO: add i18n
          message: 'Edit distance must be numeric',
        }
      }

      return message
    },
    rawResultList () {
      if (this.query.length < 1) { return [] }

      const { isAdvancedSearch, isFuzzy, hasEditDistance } = this.queryMetadata
      const results = []

      if ((isAdvancedSearch && !isFuzzy) || (isAdvancedSearch && hasEditDistance)) {
        index && results.push(...index.search(this.query))
      } else {
        const forwardSearchResults = index.search(`${this.query}*`)
        const containSearchResults = index.search(`*${this.query}*`)
        const fuzzySearchResults = index.search(`*${this.query}*~2`)

        results.push(...forwardSearchResults)
        forwardSearchResults.length < 1 && results.push(...containSearchResults)
        forwardSearchResults.length < 1 && containSearchResults.length < 1 && results.push(...fuzzySearchResults)
      }

      return results
    },
    documentResultList () {
      return this.rawResultList.map(({ ref, score, matchData }) => {
        const document = documentList ? documentList.find(document => document.id === ref) : {}
        return {
          ref,
          score,
          matchData: {
            ...matchData,
            document,
          },
        }
      })
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
      return this.documentResultList.map(({ ref, score, matchData: { metadata, document } }) => {
        const contextList = []

        Object.entries(metadata).forEach(([
          term,
          entry,
        ]) => {
          Object.entries(entry).forEach(([
            field,
            { position: positionList },
          ]) => {
            const wrappedTerm = wrapTerm(document[field], positionList)
            const truncatedTermContextList = truncateTermContext(wrappedTerm).map(ctx => ({
              ...ctx, term,
            }))

            contextList.push(...truncatedTermContextList)
          })
        })

        return {
          ref,
          score,
          matchData: {
            metadata,
            document,
            contextList,
          },
        }
      })
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
        index = this.$lunr.Index.load(responseList[0].data)
        documentList = responseList[1].data
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
