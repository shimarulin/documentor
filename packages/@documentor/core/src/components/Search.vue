<template>
  <div>
    <input
      id="search"
      v-model="query"
      class="input"
      type="text"
      placeholder="Search"
    >
    <!--    <g-link-->
    <!--      v-for="result in searchResults"-->
    <!--      :key="result.id"-->
    <!--      :to="result.path"-->
    <!--      class="navbar-item"-->
    <!--    >-->
    <!--      {{ result.title }}-->
    <!--    </g-link>-->
    <ul>
      <li
        v-for="result in processedResults"
        :key="result.id"
      >
        <g-link :to="result.path">
          <h3 v-html="result.title"/>
          <div class="context">
            ---
          </div>
        </g-link>
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
export default {
  name: 'Search',
  data: () => ({
    query: '',
    results: [],
    options: {
      includeScore: true,
      includeMatches: true,

      maxPatternLength: 32,
      minMatchCharLength: 1,

      // threshold: 0,
      // location: 5,
      // distance: 1000,

      threshold: 0.6,
      // tokenize: true,
      location: 0,
      distance: 10000,

      keys: [
        'node.title',
        // 'node.headings.value',
        'node.content',
      ],
      // keys: [
      //   {
      //     name: 'node.title',
      //     weight: 0.5,
      //   },
      //   {
      //     name: 'node.headings.value',
      //     weight: 0.3,
      //   },
      //   {
      //     name: 'node.content',
      //     weight: 0.2,
      //   },
      // ],
    },
  }),
  computed: {
    processedResults () {
      return this.$highlight(this.results).map(result => {
        // console.log(result.node.content)
        const html = this.$processor.processSync(result.node.content).contents
        return {
          id: result.node.id,
          title: result.node.title,
          path: result.node.path,
          context: html,
        }
      })
    },
  },
  watch: {
    $route (to, from) {
      this.query = ''
    },
    query (nextQuery, prev) {
      const isMinQuery = nextQuery.length >= 3
      const options = {
        ...this.options,
        minMatchCharLength: nextQuery.length - 1,
      }
      if (isMinQuery) {
        this.$search(nextQuery, this.$static.allDocumentation.edges, options)
          .then(results => {
            this.results = results
          })
      } else {
        this.results = []
      }
    },
  },
  // mounted () {
  //   console.log(this)
  // },
}
</script>

<style scoped>

</style>
