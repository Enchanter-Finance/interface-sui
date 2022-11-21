<template>
   <div class="swap__container">
      <add-lp></add-lp>
    </div>
</template>

<script setup>
import AddLp from "@/components/add/AddLp.vue"
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import { onBeforeUnmount } from "vue"
const store = useStore()
store.commit(MutationType.ResetSelectedToken)
onBeforeUnmount(() => {
  store.commit(MutationType.SetSelectTokenTopValue, '')
  store.commit(MutationType.SetSelectTokenBottomValue, '')
  store.commit(MutationType.setIsAddOrCreate, '')
})
</script>

<style lang="scss">
.swap {
  &__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 44px 16px 0;
    -webkit-box-align: center;
    align-items: center;
    flex: 1 1 0;
    z-index: 1;
  }
}
</style>
