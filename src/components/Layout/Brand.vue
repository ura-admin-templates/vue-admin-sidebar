<template>
  <a href="#" class="brand">
     <img v-if="brandIcon" :src="brandIcon" alt="brand icon" class="brand-icon">
    <span class="brand-label">{{brandLabel}}</span>
  </a>
</template>

<script>
export default {
  name: 'brand',
  props: {
    brandIcon: {
      type: String
    },
    brandLabel: {
      type: String
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {}
}
</script>
