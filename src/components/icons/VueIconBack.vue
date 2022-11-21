

<template>
  <svg class="back-icon" @click="back" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C3C5CB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
</template>

<script setup>
const emit = defineEmits(['showtoast'])
const back = ()=> {
  emit('click')
}
</script>

<style lang="scss">
.back-icon{
  cursor: pointer; 
}
</style>