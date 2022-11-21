<template>
  <Transition name="fade">
    <div v-if="show" class="swap-title">Coming Soon...</div>
  </Transition>  
</template>

<script>

export default {
  props:['show']
}
</script>

<style lang="scss" scoped>
.swap-title{
  line-height: 32px;
  border-radius: 16px;
  color: #fff;
  font-size: 12px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1); 
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 10vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>