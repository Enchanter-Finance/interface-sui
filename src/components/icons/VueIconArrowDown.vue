
<template>
  <svg class="addlp-arrow-down" :class="{'active':isActive}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B54FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 10px;"><polyline points="6 9 12 15 18 9"></polyline></svg>
</template>

<script>

export default {
  name: "VueIconArrowDown",
  props:{
    isActive:{
      type: Boolean,
      default: false,
    }
  }
}
</script>
<style lang="scss" scoped>
.addlp-arrow-down{
  transform: none;
    transition: transform 0.2s linear 0s;
    &.active{
      transform: rotate(180deg);
    }
}
</style>


