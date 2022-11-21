<template>
  <vue-modal
    :show="show"
    @close="closePromptModal"
    title="You will receive"
    class="add-modal__prompt"
  >
  <div class="add-prompt_container">
    <div class="top-number flex align--end">
      <span class="receive-lp">{{lpAmount}}</span>
      <div class="flex logos">
        <img class="c-logo" :src="getImgUrl(selectedTokenTop.logo)" alt="">
        <img class="c-logo" :src="getImgUrl(selectedTokenBottom.logo)" alt="">
      </div>
    </div>
    <div class="pair-txt">{{selectedTokenTop.symbol}}/{{selectedTokenBottom.symbol}} Pool Tokens</div>
    <div class="itlaic-desc">
      Output is estimated. If the price changes by more than {{slipage}}% your transaction will revert.
    </div>
    <div class="info-wrapper">
      <div class="row-txt flex justify--space-between align--center">
        <span>{{ selectedTokenTop.symbol }} Deposited</span>
        <div class="deposited-top flex align--center">
          <img class="common-deposit-logo" :src="getImgUrl(selectedTokenTop.logo)" alt="">          
          <span class="num">{{formatDecimalsNum(selectedTokenTop.value)}}</span>
        </div>
      </div>
      <div class="row-txt flex justify--space-between align--center">
        <span>{{ selectedTokenBottom.symbol }} Deposited</span>
        <div class="deposited-bot flex align--center">
          <img class="common-deposit-logo" :src="getImgUrl(selectedTokenBottom.logo)" alt="">          
          <span class="num">{{formatDecimalsNum(selectedTokenBottom.value)}}</span>
        </div>
      </div>
        <div class="row-txt flex justify--space-between align--center">
          <span class="rate-title">Rates</span>
          <div class="flex flex--column">
            <div class="flx-ri">1{{selectedTokenTop.symbol}} = {{formatDecimalsNum(selectedTokenBottom.value / selectedTokenTop.value)}} {{selectedTokenBottom.symbol}}</div>
            <div class="flx-ri">1{{selectedTokenBottom.symbol}} = {{formatDecimalsNum(selectedTokenTop.value / selectedTokenBottom.value)}} {{selectedTokenTop.symbol}}</div>
          </div>
        </div>
        <div class="shares flex justify--space-between align--center">
          <span>Share of Pool:</span>
          <span>{{share}}</span>
        </div>
    </div>
    <div class="confirm-btn">
      <vue-button :span="12" look="main" size="lg" @handleClick="confirmSwap"> Confirm Supply </vue-button>
    </div>
  </div>
  </vue-modal>
</template>

<script>
import { ref, computed } from "vue"
import VueModal from "@/components/modal/VueModal.vue"
import VueButton from "@/components/button/VueButton.vue"
import VueIconConfirmArrow from "@/components/icons/VueIconConfirmArrow.vue"
import { formatDecimalsNum, decimalToAmount } from '@/utils/index'

import { MutationType } from "@/store/mutations"
import { useStore } from 'vuex'
export default {
  name: "VueModalSelectToken",
  components: { VueModal, VueButton, VueIconConfirmArrow },
  props: {
    show: { 
      type: Boolean,
      default: false,
     }
  },  
  setup(props, { emit }) {
    let selectedTokenTop = computed(() => store.state.selectedTokenTop)
    let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)
    let slipage = computed(() => store.state.slipage)
    let currentLpData = computed(() => store.state.currentLpData)

    let share = computed(() => {
      if(currentLpData.value === null){
        return '100%'
      }else{
        const { value, decimals } = selectedTokenTop.value
        let percantage = decimalToAmount(value, decimals) / (currentLpData.value.coinXReserve + decimalToAmount(value, decimals)) * 100
        if(percantage < 0.01) return `<${0.01}%`
        return `${percantage.toFixed(3)}%`
      }      
    })

    let lpAmount = computed(() => {
      // if is create lp =  sqrt(x*y)
      if(currentLpData.value === null){
        return Math.sqrt(selectedTokenTop.value.value * selectedTokenBottom.value.value).toFixed(8)
      }else{
        const lpTotal = currentLpData.value.lpAmount

        const share = selectedTokenTop.value.value / (currentLpData.value.coinXReserve + selectedTokenTop.value.value)
        return (share * lpTotal).toFixed(8)
      }
    })

    const getImgUrl = (logo) => new URL(`../../../assets/images/${logo  || "default_token_logo.png" }`, import.meta.url).href; 

    const store = useStore()
    const closePromptModal = ()=>{
      store.commit(MutationType.ResetAddModal)
    }
    const confirmSwap = ()=>{
      emit('confirmSwap')
    }


    const slideInfo = computed(() => store.state.slideInfo)
    const SlippageTolerance = computed(() => store.state.slipage)

    return{
      closePromptModal,
      confirmSwap,
      slideInfo,
      SlippageTolerance,
      selectedTokenTop,
      selectedTokenBottom,
      getImgUrl,
      share,
      lpAmount,
      slipage,
      formatDecimalsNum
    }
  },
}

</script>

<style lang="scss">
.add-modal__prompt{
  font-size: 14px;
  .confirm-btn{
    margin-top: 16px;
  }
  .add-prompt_container{
    line-height: 1;
    .logos{
      margin-bottom: 10px;
    }
    .receive-lp{
      font-size: 40px;
      padding-right: 3px;     
    }
    .c-logo{
      width: 24px;
      height: 24px;
      border-radius: 50%;
      & + .c-logo{
        position: relative;
        left: -12px;
      }
    }
    .pair-txt{
      font-size: 24px; 
      padding-top: 16px;      
    }
    .num{
      padding-left: 4px;
    }
    .row-txt{
      font-size: 16px;
    }
    .itlaic-desc{
      font-weight: 500;
      font-size: 12px;
      font-style: italic;
      text-align: left;
      padding: 14px 0px 14px;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.5);
    }
    .info-wrapper{
        border: 1px solid #584A6F;
        border-radius: 12px;
        padding: 16px;
      .common-deposit-logo{
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
      .flx-ri{
        text-align: right;
        padding-bottom: 16px;
      }
      .shares{        

      }
      .row-txt + .row-txt{
        margin-top: 16px;
      }
      .rate-title{
        align-self: flex-start;
      }
    }
    
  }
}

</style>
