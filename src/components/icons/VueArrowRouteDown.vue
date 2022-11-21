<template>
  <div class="arrow-down" @mouseover="isHover = true" @mouseleave="isHover = false">    
    <svg v-show="!isHover" width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 13.3135L1.3471 7.65268M7 13.3135L7 1M7 13.3135L10.5 9.81836L12.6608 7.66057" stroke="white" stroke-width="1.4" stroke-linecap="square"/>
    </svg>
    
    <svg v-show="isHover" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.50383 10.1531L7.15674 13.8139L7.15674 1.50042" stroke="white" stroke-width="1.4" stroke-linecap="square"/>
      <path d="M17.9644 5.65581L12.3096 1.99895L12.3182 14.3124" stroke="white" stroke-width="1.4" stroke-linecap="square"/>
    </svg>
    
  </div>
</template>
<script setup>
import {  ref, provide } from "vue"
let isHover = ref(false)
</script>

<style lang="scss" scoped>
.arrow-down{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease 0s, opacity 0.2s ease 0s;
  &:hover{
    background: #8B54FF;
    border: 2px solid #5D34B4;
  }
}


</style>
