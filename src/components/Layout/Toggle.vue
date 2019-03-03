<template>
    <a href="javascript:;" @click="collapse" class="ura-toggle" :class="{'is-active':isActive}" role="button">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </a>
</template>

<style lang="scss" scoped>
  .ura-toggle{
    padding: 16px 20px;
    float: left;
    .icon-bar{
      width: 20px;
      height: 2px;
      display: block;
      margin-bottom: 4px;
    }
  }

</style>
<script>
export default {
  name: 'toggle',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    collapse: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
