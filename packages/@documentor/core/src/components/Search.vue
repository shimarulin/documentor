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
import Search from 'gridsome-plugin-flexsearch/SearchMixin'
export default {
  name: 'Search',
  mixins: [
    Search,
  ],
}
</script>

<style scoped>

</style>
