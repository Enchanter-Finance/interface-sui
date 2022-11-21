<template>
  <div class="accordion">
    <div class="accordion__top flex justify--space-between align--center" :class="{'active': isShow}" @click="isShow = !isShow">
      <div class="accordion__top--text flex align--center">
        <div v-if="isLoading" class="flex justify--space-between align--center">
          <VueIconCIrcle class="icon-circle-comp"/>
          Fetching best price...          
        </div>
        <div v-else class="flex justify--space-between align--center">
          <svg class="dSbiPJ" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>        
          <span>1 {{slideInfo.x}} = {{formatDecimalsNum(selectedTokenBottom.value/selectedTokenTop.value)}} {{slideInfo.y}}</span>
        </div>
      </div>
      <div class="accordion__top--img flex align--center">
        <svg class="accordion__top--svg" :class="{'active':isShow}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8F96AC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
    </div>
    <Transition name="slide">
      <div v-if="isShow && slideInfo" class="accordion__content">
          <div class="accordion__content--top">
            <div class="flex justify--space-between">
              <div class="flex align--center justify--space-between"> 
                <span class="text-left">Expected Output</span>
                <vue-tooltip tip="The amount you expect to receive at the current market price. You may receive less or more if the market price changes while your transaction is pending." direction="right">                  
                  <VueIconQues/>
                </vue-tooltip>
              </div>
              <span>{{formatDecimalsNum(slideInfo.amountBot)}} {{ slideInfo.y }}</span>
            </div>
            <div class="accordion__content--impact flex justify--space-between">
              <div class="flex align--center justify--space-between"> 
                <span class="text-left">Price Impact</span>
                <vue-tooltip tip="The impact your trade has on the market price of this pool." direction="right">
                  <VueIconQues/>
                </vue-tooltip>
              </div>
              <span :class="`${colorNames}`">{{priceImpactText}}</span>
            </div>
            <div class="accordion__content--impact flex justify--space-between">
              <div class="flex align--center justify--space-between"> 
                <span class="text-left">Liquidity Provider Fee</span>
                <vue-tooltip tip="For each trade a 0.30% fee is paid." direction="right">
                  <VueIconQues/>
                </vue-tooltip>
              </div>
              <span>{{LiquidityFee}}</span>
            </div>
          </div>
          <div class="accordion__content--bot flex justify--space-between">
            <span>{{ positionText }} after slippage ({{SlippageTolerance}}%) </span>            
            <span>{{calAmount}} {{ basedPosition === 'top' ? slideInfo.y : slideInfo.x }}</span>
          </div>
      </div>
    </Transition>
    <div v-if="showBotPriceImpact" class="impact-block">
      <div class="flex justify--space-between" :class="`${colorNames}`">
        <span>Price Impact Warning</span>
        <span>{{priceImpactText}}</span>
      </div>
    </div>
  </div>
</template>

<script setup>

import VueColumn from "@/components/layout/VueColumn/VueColumn.vue";
import VueIconCIrcle from "@/components/icons/VueIconCIrcle.vue"
import VueIconQues from "@/components/icons/VueQues.vue"
import VueTooltip from "@/components/tooltip/VueTooltip.vue"
import { useStore } from 'vuex'
import { toFixed, formatDecimalsNum, decimalToAmount } from '@/utils/index'
import { ref, computed, watch } from "vue"
const store = useStore()
const isShow = ref(false)
let isLoading = computed(() => store.state.slideInfoLoading)
const slideInfo = computed(() => store.state.slideInfo)
const liquidityRate = computed(() => store.state.liquidityFee)
const SlippageTolerance = computed(() => store.state.slipage)
let basedPosition = computed(()=> store.state.basedPosition)
let selectedTokenTop = computed(() => store.state.selectedTokenTop)
let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)
let positionText = computed(() => basedPosition.value === 'top' ? 'Minimum received' :'Maximum sent')


const calAmount = computed(() => {
  if(basedPosition.value === 'top'){
    return formatDecimalsNum(slideInfo.value?.amountBot * (1 - SlippageTolerance.value * 0.01))
  }else{
    return formatDecimalsNum(slideInfo.value?.amountTop * (1 + SlippageTolerance.value * 0.01))
  }
})

const priceImpact = computed(() => {
  if(!slideInfo.value) return 0
  let { reserveX } = slideInfo.value
  let { value:topVal, decimals } = selectedTokenTop.value
  // let { value:botVal } = selectedTokenBottom.value
  // https://ethereum.stackexchange.com/questions/102063/understand-price-impact-and-liquidity-in-pancakeswap
  const fee = 0.0000
  let amountInWithFee = topVal * (1 - fee);
  amountInWithFee = decimalToAmount(amountInWithFee, decimals)
  const price_impact = amountInWithFee / (reserveX + amountInWithFee) * 100;
  return price_impact
})

const priceImpactText = computed(() => {
  return `-${priceImpact.value.toFixed(2)}%`
})

const showBotPriceImpact = computed(() => {
  return priceImpact.value >= 10
})

const LiquidityFee = computed(() => {
  let { value, symbol } = selectedTokenTop.value
  return `${formatDecimalsNum(liquidityRate.value * value)} ${symbol}`
})

const colorNames = computed(() => {
  const theme = priceImpact.value >= 5 ? 'alerting' : (
    priceImpact.value >= 3 ? 'warning' : ''
  )
  return theme
})



</script>

<style lang="scss">
.accordion{
  font-size: 14px;  
  padding: 4px 0;
  .warning{
    color: #FFA869;
  }
  .alerting{
    color: #EB264A;    
  }
  .impact-block{
     border: 1px solid #584A6F;
     padding: 16px;
     border-radius: 12px;
     line-height: 1;
     margin-top: 12px;
  }
  .accordion__content{    
    margin: 13px 0 6px;
  }
  .dSbiPJ{
    width: 17px;
    margin-right: 0.3em;
  }
  &__top{
    cursor: pointer;
    border-radius: 12px;
    line-height: 41px;
    padding:0 8px;
    &--svg{
      transform: none;
      transition: transform 0.2s linear 0s;
      &.active{
        transform: rotate(180deg);
      }
    }
    &.active{
      background: rgba(227, 197, 245, 0.1);
    }
    .icon-circle-comp{
      margin-right: 6px;
    }
  }
  &__content{    
    border-radius: 16px;
    margin-top: 8px;    
    border: 1px solid rgb(64, 68, 79);
    box-sizing: border-box;
    &--top{
      padding: 12px 12px 16px;
      
      .text-left{
        padding-right: 6px;
      }
    }
    &--impact{
      margin-top:8px;
    }
    &--bot{
      border-top: 1px solid rgb(44, 47, 54);
      padding-top: 8px;
      color: rgb(143, 150, 172);
      padding: 12px;
    }
  }
}

.slide-enter-active {
   -moz-transition-duration: 0.2s;
   -webkit-transition-duration: 0.2s;
   -o-transition-duration: 0.2s;
   transition-duration: 0.2s;
   -moz-transition-timing-function: ease-in;
   -webkit-transition-timing-function: ease-in;
   -o-transition-timing-function: ease-in;
   transition-timing-function: ease-in;
}

.slide-leave-active {
   -moz-transition-duration: 0.2s;
   -webkit-transition-duration: 0.2s;
   -o-transition-duration: 0.2s;
   transition-duration: 0.2s;
   -moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   -o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
   transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-from,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 130px;
  overflow: hidden;
}
</style>