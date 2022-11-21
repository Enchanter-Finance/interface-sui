<template>
  <vue-modal
    :show="show"
    @close="closeModal"
    class="modal__confirm"
  >
    <div class="flex flex--column align--center">
      <svg class="spinner" width="94" height="94" viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M92 47C92 22.1472 71.8528 2 47 2C22.1472 2 2 22.1472 2 47C2 71.8528 22.1472 92 47 92" stroke="#2172E5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div class="pending-tip">Waiting For Confirmation</div>
      <div class="pending-info">{{transactionInfo}}</div>
      <span class="pending-text">Confirm this transaction in your wallet</span>
    </div>
  </vue-modal>
</template>



<script setup>

import VueModal from "@/components/modal/VueModal.vue"
import { reactive, toRefs, computed } from 'vue'
import { MutationType } from "@/store/mutations"
import { formatDecimalsNum } from '@/utils/index'
const store = useStore()
import { useStore } from 'vuex'
  defineProps({
    show:Boolean
  })
  let selectedTokenTop = computed(() => store.state.selectedTokenTop)
  let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)
  let transactionInfo = computed(() => `Supply ${formatDecimalsNum(selectedTokenTop.value.value)}${selectedTokenTop.value.symbol} and ${formatDecimalsNum(selectedTokenBottom.value.value)} ${selectedTokenBottom.value.symbol}`)  
  
  const closeModal = ()=>{
    store.commit(MutationType.SetAddConfirmModal, false)  
  }

</script>




