<template>
  <div>
    <input
      id="search"
      v-model="searchTerm"
      class="input"
      type="text"
      placeholder="Search"
    >
    <g-link
      v-for="result in searchResults"
      :key="result.id"
      :to="result.path"
      class="navbar-item"
    >
      {{ result.title }}
    </g-link>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data: () => ({
    searchTerm: '',
  }),
  computed: {
    searchResults () {
      const query = this.searchTerm

      // console.log(this.$search.info())
      console.log(
        this.$search.search({
          query,
          limit: 5,
          depth: 5,
          threshold: 5, // >= threshold
          suggest: true,
        }),
      )

      return query.length < 2 ? [] : this.$search.search({
        query,
        limit: 5,
        depth: 5,
        suggest: true,
      })
    },
  },
  watch: {
    $route (to, from) {
      this.searchTerm = ''
    },
  },
  mounted () {
    this.$search.init({
      encode: 'advanced',
      tokenize: 'full',
      // threshold: 1,
      // resolution: 3,
      // depth: 3,

      // async: true,
      // worker: 4,
    })
  },
}
</script>

<style scoped>

</style>
