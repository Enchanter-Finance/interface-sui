<template>
  <vue-modal
    :show="show"
    @close="closeModal"
    class="modal__confirm"
  >
    <div class="flex flex--column align--center">
      <svg class="spinner" width="124" height="124" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M62 2C95.1371 2 122 28.8629 122 62C122 95.1371 95.1371 122 62 122C28.8629 122 2 95.1371 2 62C2 44.8783 9.17165 29.4316 20.6749 18.5" stroke="url(#paint0_angular_365_1482)" stroke-width="4" stroke-linecap="round"/>
        <defs>
        <radialGradient id="paint0_angular_365_1482" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(62 62) rotate(-137.603) scale(62.2896 60.6628)">
        <stop offset="0.000929043" stop-color="#8B54FF" stop-opacity="0"/>
        <stop offset="0.143428" stop-color="#8B54FF"/>
        </radialGradient>
        </defs>
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
  let transactionInfo = computed(() => `Swap ${formatDecimalsNum(selectedTokenTop.value.value)} ${selectedTokenTop.value.symbol} for ${formatDecimalsNum(selectedTokenBottom.value.value)} ${selectedTokenBottom.value.symbol}`)  
  
  const closeModal = ()=>{
    store.commit(MutationType.SetExchangeConfirmModal, false)  
  }

</script>


<style lang="scss">
@keyframes rotate{
   from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal__confirm{
  .pending-tip{    
    font-weight: 500;
    font-size:20px;
    padding-bottom: 10px;
    padding-top: 16px;
  }
  .pending-info{
    font-weight:600;
    font-size:16px;
    margin-bottom: 16px;
  }
  .pending-text{
    font-weight:400;
    font-size:14px;
    // margin-bottom: 12px;
    color: rgba(255, 255, 255, 0.5);
  }
  .spinner{
    margin-top: 40px;
    width: 90px;
    height: 90px;    
    animation: 2s rotate linear infinite;
  }
}
</style>



