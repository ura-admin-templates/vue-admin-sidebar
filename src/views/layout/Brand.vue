<template>
  <ura-brand :brandIcon="brandIcon" :brandLabel="brandLabel"></ura-brand>
</template>

<script>
import UraBrand from '@/components/Layout/Brand.vue'
export default {
  name: 'brand',
  data () {
    return {
      brandIcon: 'http://dummyimage.com/64x64/50B347/FFF&text=O',
      brandLabel: '系统管理平台'
    }
  },
  components: { UraBrand },
  computed: {
  },
  methods: {}
}
</script>
