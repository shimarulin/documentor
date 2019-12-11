<template>
  <div class="search page">
    <button @click="$router.back()">
      back
    </button>
    <Search/>
  </div>
</template>

<script>
export default {
  name: 'SearchPage',
  created () {
    document.addEventListener('keyup', this.handleKeyup)
  },
  mounted () {
    console.log(this)
    // console.log(this.config.keyCodes)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.handleKeyup)
  },
  methods: {
    handleKeyup (e) {
      if (e.keyCode === 27) {
        this.$router.back()
      }
    },
  },
}
</script>

<style scoped>

</style>
