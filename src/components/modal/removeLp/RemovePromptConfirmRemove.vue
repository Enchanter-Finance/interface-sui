<template>
  <vue-modal
    :show="show"
    @close="closePromptModal"
    title="You will receive"
    class="remove-modal__prompt"
  >
  <div class="remove-prompt_container">
    <div class="receive-info">
      <div class="receive-line flex justify--space-between align--center">
        <span class="receive-balance">{{formatDecimalsNum(result.coinXBurn)}}</span>
        <div class="flex align--center">
          <img class="b-symbol-logo" :src="getImgUrl(result.coinXInfo.logo)" alt="">
          <span class="symbol-txt">{{result.coinXInfo.symbol}}</span>
        </div>
      </div>
      <div class="add-svg">
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.5" d="M12.812 5.704H7.87V0.943999H4.93V5.704H0.00200009V8.434H4.93V13.278H7.87V8.434H12.812V5.704Z" fill="white"/>
        </svg>
      </div>
      <div class="receive-line flex justify--space-between align--center">
        <span class="receive-balance">{{formatDecimalsNum(result.coinYBurn)}}</span>
        <div class="flex align--center">
          <img class="b-symbol-logo" :src="getImgUrl(result.coinYInfo.logo)" alt="">
          <span class="symbol-txt">{{result.coinYInfo.symbol}}</span>
        </div>
      </div>
    </div>      
    <div class="itlaic-desc">
      Output is estimated. If the price changes by more than {{slipage}}% your transaction will revert.
    </div>
    <div class="burn-info">
      <div class="burn-info-top flex justify--space-between align--center">
        <span class="top-left">{{result.coinXInfo.symbol}}/{{result.coinXInfo.symbol}} Burned</span>
        <div class="top-right flex align--center">
          <img class="info-img" v-for="item in [result.coinXInfo.logo, result.coinYInfo.logo]" :key="item.id" :src="getImgUrl(item)" />
          <span class="info-amount">{{result.burnAmount}}</span>
        </div>
      </div>
      <div class="burn-info-bot flex justify--space-between">
          <span class="bot-left">Price</span>
          <div class="bot-right">
            <div class="bot-right-1">1 {{result.coinXInfo.symbol}} = {{formatDecimalsNum(result.coinYBurn / result.coinXBurn)}} {{result.coinYInfo.symbol}}</div>
            <div class="bot-right-2">1 {{result.coinYInfo.symbol}} = {{formatDecimalsNum(result.coinXBurn / result.coinYBurn)}} {{result.coinXInfo.symbol}}</div>
          </div>
      </div>
    </div>
    <div class="confirm-btn">
      <vue-button :span="12" look="main" size="lg" @handleClick="confirmSwap"> Confirm </vue-button>
    </div>
  </div>
  </vue-modal>
</template>

<script>
import { ref, computed } from "vue"
import VueModal from "@/components/modal/VueModal.vue"
import VueButton from "@/components/button/VueButton.vue"
import VueIconConfirmArrow from "@/components/icons/VueIconConfirmArrow.vue"
import { toFixed, formatDecimalsNum, amountToDecimal } from '@/utils/index'
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
    const getImgUrl = (logo) => new URL(`../../../assets/images/${logo || "default_token_logo.png" }`, import.meta.url).href; 
    const tokenList = computed(() => store.state.tokenList)
    const store = useStore()
    let slipage = computed(() => store.state.slipage)
    const getCoinInfo = (address)=>{
      return tokenList.value.find(_ => _.address === address)
    }
    
    const removeData = computed(() => store.state.removeData)

    const result = computed(() => {
      const data = removeData.value || {}
      return {
        burnAmount:toFixed(amountToDecimal(data.lpAmount, data.lpDecimals)),
        coinXBurn:toFixed(amountToDecimal(data.coinXDecimals, data.XDecimals)),
        coinYBurn:toFixed(amountToDecimal(data.coinYDecimals, data.YDecimals)),
        coinXInfo:getCoinInfo(data.coinX),
        coinYInfo:getCoinInfo(data.coinY)
      }
    })

    const closePromptModal = ()=>{
      store.commit(MutationType.ResetRemoveModal)
    }
    
    const confirmSwap = ()=>{
      emit('confirmSwap')
    }
    return{
      confirmSwap,
      closePromptModal,
      result,
      getImgUrl,
      slipage,
      formatDecimalsNum
    }
  },
}

</script>

<style lang="scss">
.remove-modal__prompt{
  font-size: 14px;
  .confirm-btn{
    margin-top: 16px;
  }
  .remove-prompt_container{
    line-height: 1;
    .add-svg{
      padding: 16px 0;
    }
    .receive-info{      
      .receive-line{
        line-height: 1;
        font-size: 22px;
      }
      .b-symbol-logo{
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      .symbol-txt{
        padding-left: 6px;
      }
    }
    .itlaic-desc{
      padding: 16px 0;
      font-style: italic;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.4;
    }

    .burn-info{
      border: 1px solid #584A6F;
      border-radius: 12px;
      padding: 16px;
      font-size: 18px;
      line-height: 1;
      .burn-info-top{
        
      }
      .info-img{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: -4px;
        & + .info-img{
          position: relative;
          left: -8px;
        }
      }
      .burn-info-bot{
        margin-top: 16px;
      }
      .bot-right-2{
        padding-top: 16px;
        text-align: right;
      }
      .bot-right-1{
        text-align: right;
      }
    }

  }
}

</style>
