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
          <div class="popup--text">Swap Exactly {{formatDecimalsNum(InCoin)}} {{selectedTokenTop.symbol}} for</div>
          <div class="popup--text">{{formatDecimalsNum(OutCoin)}} {{selectedTokenBottom.symbol}}</div>
          <a class="explorer" :href="`https://explorer.aptoslabs.com/txn/${version}?network=testnet`" target="_blank">View on Explorer</a>
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
import { onBeforeUnmount, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import { toFixed, formatDecimalsNum, amountToDecimal } from '@/utils/index'
export default {
  setup(props, { emit }) {
    let timer;
    const store = useStore()
    const version = ref('')
    timer = setTimeout(() => {
      onClose()
    }, 8000);

    let selectedTokenTop = computed(() => store.state.selectedTokenTop)
    let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)
    let transaction = computed(() => store.state.transaction)    
    const events = transaction.value.events
    let InCoin = 0
    let OutCoin = 0    
    if(events.length){
      console.log('events', events)
      const { decimals: topDecimals } = selectedTokenTop.value
      const { decimals: botDecimals } = selectedTokenBottom.value
      const data = events.find(_ => _.type.indexOf('SwapEvent') !== -1)
      InCoin = data?.data.in_amount
      InCoin = toFixed(amountToDecimal(InCoin, topDecimals))
      OutCoin = data?.data.out_amount
      OutCoin = toFixed(amountToDecimal(OutCoin, botDecimals))
      version.value = transaction.value.hash
    }else{
      version.value = transaction.value.hash
    }

    onBeforeUnmount(() => {
      clearTimeout(timer)
      timer = null  
    })
    const onClose = () => store.commit(MutationType.SetShowTransactionPopUp, false)
    return {
      onClose,
      selectedTokenBottom,
      selectedTokenTop,
      InCoin,
      OutCoin,
      formatDecimalsNum,
      version
    }
  }
}
</script>

<style lang="scss">
.popup{
    position: fixed;
    top: 90px;
    right: 36px;
    max-width: 355px !important;
    width: 100%;
    z-index: 3;
    &__container{
      position: relative;
      padding: 16px;
      background: #342A4A;
      position: relative;
      border-radius: 8px;
      padding-right: 35px;
      overflow: hidden;      
    }
    &--text{
      line-height: 1.3;
      & + &{
        padding-bottom: 5px;
      }
    }
     &--wrapper{
        .popup--content{
          padding-left: 20px;
        }
      }
      &__fader{
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 2px;
        background-color: #4A249B;
        animation: remove 8s;
      }

    .feather-x{
      position: absolute;
      right: 16px;
      top: 16px;
      &:hover {
        cursor: pointer;
      }
    }
    .explorer{
      color: #8B54FF;
      text-decoration: auto;      
      cursor: pointer;
    }
  
}
@keyframes remove {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>