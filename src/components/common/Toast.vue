<template>
  <div class="swap-title">{{showText}}</div>
</template>

<script>

import { onBeforeUnmount } from "vue"
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
export default {
  props:['showText'],
  setup () {
    const store = useStore()  
    var timer;
    const clearTimer = ()=>{
      store.commit(MutationType.SetshowToast, false)
      clearTimeout(timer)
      timer = null
    }
    if(timer) return 
    timer = setTimeout(()=>{
      clearTimer()
    }, 2000)
    
    onBeforeUnmount(() => {
      clearTimer()
    })
    return {

    }
  }
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
  top: 13vh;
}

</style>