<template>
  <div class="app-container">
    <p v-for="item in 100" :key="item">
     project list \{{ item }}
    </p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>

</style>
