<template>
  <div class="search">
    <input
      v-model="query"
      class="search_input"
      type="text"
      placeholder="Search"
    >

    {{ result }}

    <div
      v-if="error"
      class="error"
    >
      {{ error.message }}: {{ error.status }} - {{ error.statusText }}
    </div>
  </div>
</template>

<static-query>
  {
    allDocumentation {
      edges {
        node {
          id
          title
          content
          path
          #          headings {
          #            anchor
          #            depth
          #            value
          #          }
        }
      }
    }
  }
</static-query>

<script>
/**
 * https://github.com/nextapps-de/flexsearch/issues/51
 * */
import FlexSearch from 'flexsearch'
import { SEARCH_SUGGESTIONS_PATH } from './lib/constants'

// let index

export default {
  name: 'Search',
  data: () => ({
    query: '',
    results: [],
    options: {},
    isIndexLoaded: false,
    error: null,
  }),
  computed: {
    index () {
      if (!this.$static.allDocumentation) {
        return
      }

      const index = new FlexSearch({
        encode: false,
        split: /\s+/,
        tokenize: 'forward',
        doc: {
          id: 'node:id',
          field: [
            'node:title',
            'node:content',
          ],
        },
      })

      // const string = 'hemanth is testing hemanth'

      index.add(this.$static.allDocumentation.edges)

      const idx = JSON.parse(index.export({
        index: true, doc: false,
      }))
      const suggestions = []

      idx.forEach(subIdx => {
        subIdx[0].forEach(idxKeys => {
          // const words = subIdx[0].map(idxKeys => idxKeys)
          suggestions.push(...Object.keys(idxKeys))
          // console.log(Object.keys(idxKeys))
        })
      })

      // console.log(suggestions)

      return index
    },
    result () {
      return this.index.search({
        query: this.query,
        suggest: true,
      })
    },
  },
  beforeMount () {
    Promise.all([
      // this.$axios
      //   .request({
      //     url: 'search-index.json',
      //     baseURL: '/',
      //   }),
      this.$axios
        .request({
          url: SEARCH_SUGGESTIONS_PATH,
          baseURL: '/',
        }),
    ])
      .then(responseList => {
        console.log(responseList)
        // index = responseList[0].data
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
