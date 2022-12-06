<template>
  <div class="popup">
    <div class="popup__container">
      <div class="popup--wrapper flex align--center">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_392_349)">
            <circle cx="18" cy="18" r="14" stroke="#00F030" stroke-width="1.4"/>
          </g>
          <path d="M24.9423 13.9426L16.8032 22.0817L11.5232 16.8017" stroke="#00F030" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <filter id="filter0_b_392_349" x="-0.699951" y="-0.700195" width="37.3999" height="37.4004" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImage" stdDeviation="2"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_392_349"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_392_349" result="shape"/>
            </filter>
          </defs>
        </svg>
        <div class="popup--content">
          <div class="popup--text">Supply Exactly {{formatDecimalsNum(InCoin)}} {{selectedTokenTop.symbol}} and</div>
          <div class="popup--text">{{formatDecimalsNum(OutCoin)}} {{selectedTokenBottom.symbol}}</div>          
          <span class="explorer" @click="openExplorer" target="_blank">View on Explorer</span>
        </div>
      </div>
      <div class="popup__fader"></div>
      <div @click="onClose">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C3C5CB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>      
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onBeforeUnmount, computed } from 'vue'
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import { toFixed, formatDecimalsNum, amountToDecimal } from '@/utils/index'
export default {
  setup(props, { emit }) {
    let timer;
    const store = useStore()
    timer = setTimeout(() => {
      onClose()
    }, 8000);

    let selectedTokenTop = computed(() => store.state.selectedTokenTop)
    let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)

    let transaction = computed(() => store.state.transaction)
    const events = transaction.value.events
    let InCoin = 0
    let OutCoin = 0

    const openExplorer = ()=>{
      window.open(`https://explorer.sui.io/transaction/${transaction.value.transactionDigest}?network=devnet`, '_blank');
    }

    if(events.length){
      const { decimals: topDecimals } = selectedTokenTop.value
      const { decimals: botDecimals } = selectedTokenBottom.value
      const data = events.find(_ => _['moveEvent']).moveEvent.fields
      InCoin = data?.real_x
      OutCoin = data?.real_y
      InCoin = toFixed(amountToDecimal(InCoin, topDecimals))
      OutCoin = toFixed(amountToDecimal(OutCoin, botDecimals))
    }else{
      
    }

    onBeforeUnmount(() => {
      clearTimeout(timer)
      timer = null  
    })
    const onClose = () => store.commit(MutationType.SetShowTransactionAddPopUp, false)
    return {
      onClose,
      selectedTokenBottom,
      selectedTokenTop,
      InCoin,
      OutCoin,
      openExplorer,
      formatDecimalsNum
    }
  }
}
</script>

