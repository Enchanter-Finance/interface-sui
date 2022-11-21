<template>
  <vue-modal
    :show="show"
    @close="closePromptModal"
    title="Confirm Swap"
    class="swap-modal__prompt"
  >
  <div class="prompt_container">
    <div class="swap-block">
      <div class="common-info-input flex justify--space-between align--center">
        <span>{{selectedTokenTop.value}}</span>
        <div class="flex justify--space-between align--center">
          <img class="incoin-logo" :src="getImgUrl(selectedTokenTop.logo)" alt="">
          <span>{{selectedTokenTop.symbol}}</span>
        </div>
      </div>
      <div class="arrow-wrapper">
        <VueArrowRouteDown/>
      </div>
      <div class="common-info-input common-info-input-bot flex justify--space-between align--center">
        <span>{{selectedTokenBottom.value}}</span>
        <div class="flex justify--space-between align--center">          
          <img class="incoin-logo" :src="getImgUrl(selectedTokenBottom.logo)" alt="">
          <span>{{selectedTokenBottom.symbol}}</span>
        </div>
      </div>
    </div>
    <div class="rate-txt">1 {{slideInfo.x}} = {{formatDecimalsNum(slideInfo.rate)}} {{slideInfo.y}}</div>
    <div class="expected-out">
      <div class="expected__content">
        <div class="expected__content--top">
          <div class="flex justify--space-between">
            <span>Expected Output</span>
            <span>{{formatDecimalsNum(slideInfo.amountBot)}} {{ slideInfo.y }}</span>
          </div>
          <div class="flex justify--space-between impact">
            
          </div>
        </div>
        <div class="expected__content--bot flex justify--space-between">
          <div>{{ positionText }} after slippage({{SlippageTolerance}}%) </div>
          <div style="text-align: right;">{{calAmount}} {{ basedPosition === 'top' ? slideInfo.y : slideInfo.x }}</div>
        </div>
      </div>
    </div>
    <div v-if="basedPosition === 'top'" class="expected--desc">
      Output is estimated. You will receive at least <span>{{calAmount}}</span> {{ slideInfo.y }} or the transaction will revert.      
    </div>
    <div v-else class="expected--desc">
      Input is estimated. You will sell at most <span> {{calAmount}}</span> {{ slideInfo.x }} or the transaction will revert.      
    </div>
    <div class="confirm-btn">
      <vue-button :span="12" look="main" size="lg" @handleClick="confirmSwap"> Confirm Swap </vue-button>
    </div>
  </div>
  </vue-modal>
</template>

<script>
import { ref, computed } from "vue"
import VueModal from "@/components/modal/VueModal.vue"
import VueButton from "@/components/button/VueButton.vue"
import VueIconConfirmArrow from "@/components/icons/VueIconConfirmArrow.vue"
import VueArrowRouteDown from "@/components/icons/VueArrowRouteDown.vue"
import { formatDecimalsNum } from '@/utils/index'

import { MutationType } from "@/store/mutations"
import { useStore } from 'vuex'
export default {
  name: "VueModalSelectToken",
  components: { VueModal, VueButton, VueIconConfirmArrow, VueArrowRouteDown },
  props: {
    show: { 
      type: Boolean,
      default: false,
     }
  },  
  setup(props, { emit }) {

    let selectedTokenTop = computed(() => store.state.selectedTokenTop)
    let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)

    const getImgUrl = (logo) => new URL(`../../../assets/images/${logo  || "default_token_logo.png"}`, import.meta.url).href; 

    const store = useStore()
    const closePromptModal = ()=>{
      store.commit(MutationType.ResetSwapModal)
    }
    const confirmSwap = ()=>{
      emit('confirmSwap')
    }
    const slideInfo = computed(() => store.state.slideInfo)
    const SlippageTolerance = computed(() => store.state.slipage)
    let basedPosition = computed(()=> store.state.basedPosition)

    let positionText = computed(() => basedPosition.value === 'top' ? 'Minimum received' :'Maximum sent')

    const calAmount = computed(() => {  
      if(basedPosition.value === 'top'){
        return formatDecimalsNum(slideInfo.value.amountBot * (1 - SlippageTolerance.value * 0.01))
      }else{
        return formatDecimalsNum(slideInfo.value.amountTop * (1 + SlippageTolerance.value * 0.01))
      }
    })



    return{
      closePromptModal,
      confirmSwap,
      slideInfo,
      SlippageTolerance,
      selectedTokenTop,
      selectedTokenBottom,
      getImgUrl,
      formatDecimalsNum,
      calAmount,
      positionText,
      basedPosition
    }
  },
}

</script>

<style lang="scss">
.swap-modal__prompt{
  font-size: 14px;
  .swap-block{
    font-size: 18px;
    position: relative;
    .common-info-input{
      background: #4C3C70;      
      border-radius: 12px;
      padding: 20px 16px;
      line-height: 1;
      box-sizing: border-box;      
      .incoin-logo{
        width: 24px;
        height: 24px;
        margin-right: 6px;
        border-radius: 50%;
      }
    }
    .arrow-wrapper{
      width: 32px;
      height: 32px;
      position: relative;
      margin-top: -8px;
      margin-bottom: -8px;
      left: calc(50% - 16px);
      z-index: 2;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .rate-txt{
    margin: 14px 0;
    padding-left: 12px;
  }
  .expected{
    &__content{    
      border-radius: 16px;
      margin-top: 8px;          
      border: 1px solid #584A6F;
      box-sizing: border-box;
      padding: 16px;
      &--top{
        .impact{
          padding: 8px 0;
        }
      }
      &--bot{
        border-top: 1px solid #584A6F;
        padding-top: 8px;
        color: rgb(143, 150, 172);
      }      
    }
    &--desc{
      padding: 12px 8px;
      font-style: italic;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      span{
        color: #fff;
      }
    }
  }  
}



</style>
