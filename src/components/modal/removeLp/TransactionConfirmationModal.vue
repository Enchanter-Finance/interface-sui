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
import { formatDecimalsNum, toFixed, amountToDecimal } from '@/utils/index'
const store = useStore()
import { useStore } from 'vuex'
  defineProps({
    show:Boolean
  })  
  const tokenList = computed(() => store.state.tokenList)
  const getCoinInfo = (address)=>{
      return tokenList.value.find(_ => _.address === address)
    }

  let removeData = computed(() => store.state.removeData)
  
  const result = computed(() => {
    const data = removeData.value || {}
    return {
      burnAmount:toFixed(amountToDecimal(data.lpAmount, data.lpDecimals)),
      coinXBurn:formatDecimalsNum(toFixed(amountToDecimal(data.coinXDecimals, data.XDecimals))),
      coinYBurn:formatDecimalsNum(toFixed(amountToDecimal(data.coinYDecimals, data.YDecimals))),
      coinXInfo:getCoinInfo(data.coinX),
      coinYInfo:getCoinInfo(data.coinY)
    }
  })
    
  let transactionInfo = computed(() => `Removing ${result.value.coinXBurn} ${result.value.coinXInfo.symbol} and ${result.value.coinYBurn} ${result.value.coinYInfo.symbol}`)  
  const closeModal = ()=>{
    store.commit(MutationType.SetRemoveConfirmModal, false)  
  }

</script>
