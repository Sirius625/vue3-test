<template>
  <div class="app">
    <List msg="Hello Vue 3 + TypeScript + Vite" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import List from './components/List.vue'

export default defineComponent({
  components: {
    List
  }
})
</script>

<style scoped>
.app {
  margin: 0 auto;
}
</style>
