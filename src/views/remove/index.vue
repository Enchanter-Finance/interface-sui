<template>
  <div class="remove__page">
    <main class="remove__container">
      <remove-header></remove-header>
      <div class="remove-block">
        <div class="remove-inner">
          <div class="inner-title flex justify--space-between align--center">
            <span class="remove-title">Remove Amount</span>
            <div class="max-quote" @click="handleMax">
              <span>Balance:{{maxTxt}}</span>
              <span class="max-txt">Max</span>
            </div>
          </div>
          <div class="main-input">
            <input 
              class="input-comp" 
              type="text" 
              minlength="1" 
              maxlength="79"
              @input="handleInput"
              @keypress="onlyForCurrency"
              :value="tokenAmount"
              placeholder="0.0"
            >
          </div>
          <div class="receive-block">
            <div class="receive-title">Receive</div>
            <div class="out-block">
              <div class="coin-out coin-X flex justify--space-between align--center">
                <span class="coin-amount">{{receive.coinX === '-' ? '-' : formatDecimalsNum(receive.coinX)}}</span>
                <div class="flex align--center">
                  <img class="coin-logo" :src="getImgUrl(coinXInfo.logo)" alt="">
                  <span class="coin-symbol">{{coinXInfo.symbol}}</span>
                </div>
              </div>
              <div class="coin-out coin-Y flex justify--space-between align--center">
                <span class="coin-amount">{{receive.coinY === '-' ? '-' : formatDecimalsNum(receive.coinY)}}</span>
                <div class="flex align--center">
                  <img class="coin-logo" :src="getImgUrl(coinYInfo.logo)" alt="">
                  <span class="coin-symbol">{{coinYInfo.symbol}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <vue-column style="margin-top:16px;">
        <vue-button v-if="!isAuthWallet" :span="12" look="main" size="lg" @handleClick="openConnectModal"> Connect Wallet </vue-button>
        <vue-button v-else-if="isNotTestNetWork" :span="12" look="disabled" size="lg"> Please Switch to Testnet </vue-button>
        <vue-button v-else-if="invalidAmount" :span="12" look="disabled" size="lg"> Enter an amount </vue-button>
        <vue-button v-else-if="isMoreThanLp" :span="12" look="disabled" size="lg"> Insuffucient LP balance</vue-button>
        <vue-button v-else :span="12" look="main" size="lg" @click="handleRemove"> Remove </vue-button>
      </vue-column>
    </main>
    <div class="my-position">
      <div class="position-inner">
        <div class="posision-title">Your position</div>
        <div class="flex justify--space-between align--center">
          <div class="position-info flex align--center">
            <img class="info-img" v-for="item in [coinXInfo.logo, coinYInfo.logo]" :key="item.id" :src="getImgUrl(item)"/>
            <span class="info-txt">{{coinXInfo.symbol}}/{{coinYInfo.symbol}}</span>
          </div>
          <div>{{formatDecimalsNum(maxTxt)}}</div>
        </div>
        
        <div class="position-item flex justify--space-between align--center">
          <span>Your pool share:</span>
          <span>{{percentage}}</span>
        </div>
        <div class="position-item flex justify--space-between align--center">
          <span>{{coinXInfo.symbol}}:</span>
          <span>{{formatDecimalsNum(maxReceive.coinX)}}</span>
        </div>
        <div class="position-item flex justify--space-between align--center">
          <span>{{coinYInfo.symbol}}:</span>
          <span>{{formatDecimalsNum(maxReceive.coinY)}}</span>          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import { MutationType } from "@/store/mutations"
import { computed, ref, watch } from "vue"
import RemoveHeader from "@/components/remove/RemoveHeader.vue"
import VueColumn from "@/components/layout/VueColumn/VueColumn.vue"
import VueButton from "@/components/button/VueButton.vue"
import { toFixed, formatDecimalsNum, amountToDecimal, decimalToAmount } from '@/utils/index'
import { ActionTypes } from "@/store/actions"
const getImgUrl = (logo) => new URL(`../../assets/images/${logo  || "default_token_logo.png"}`, import.meta.url).href;

const store = useStore();
const router = useRoute();
const { coinX, coinY } = router.params  
const address = computed(() => store.state.address)
const maxTxt = ref(0)
const percentage = ref('')
const maxReceive = ref({})

const isMoreThanLp = ref(false)
const receive = ref({
  coinX:'-',
  coinY : '-'
})


const tokenAmount = ref('')
const reserveData = ref({})
const lpData = ref({})
const coinXInfo = ref({})
const coinYInfo = ref({})

const tokenList = computed(() => store.state.tokenList)

let isNotTestNetWork = computed(() => store.state.netWork !== 'Testnet')


const getCoinInfo = (address)=>{
  return tokenList.value.find(_ => _.address === address)
}

const isAuthWallet = computed(() => store.state.isAuthWallet)

let invalidAmount = computed(() => tokenAmount.value == 0)

const openConnectModal = () => {
  store.commit(MutationType.SetConnectModal, true)
  store.commit(MutationType.ResetWalletList)  
}



const getOutInfo = async(coinX, coinY)=>{

  const resLpData = await window.SDK.getCurrentLPAmount(address.value, coinX, coinY)
  
  maxTxt.value = resLpData.lpValue
  lpData.value = resLpData
  percentage.value = resLpData.share * 100 < 0.01 ? `<${0.01}%` : `${(resLpData.share * 100).toFixed(5)}%`
  const resReserveData = await window.SDK.getReserveData(coinX, coinY);
  
  reserveData.value = resReserveData
  
  const xAmount = toFixed(amountToDecimal(resLpData.share * resReserveData.x, coinXInfo.value.decimals))
  const yAmount = toFixed(amountToDecimal(resLpData.share * resReserveData.y, coinYInfo.value.decimals))

  maxReceive.value = {
     coinX : xAmount,
     coinY : yAmount
  }
}

const handleRemove = ()=>{
  store.commit(MutationType.SetRemoveData, {
    coinX, coinY,
    
    lpDecimals:lpData.value.decimals,
    XDecimals:coinXInfo.value.decimals,
    YDecimals:coinYInfo.value.decimals,

    lpAmount:parseInt(decimalToAmount(tokenAmount.value, lpData.value.decimals)),

    coinXDecimals:decimalToAmount(receive.value.coinX, coinXInfo.value.decimals), 
    coinXOut:parseInt(decimalToAmount(receive.value.coinX, coinXInfo.value.decimals)),

    coinYDecimals:decimalToAmount(receive.value.coinY, coinYInfo.value.decimals),
    coinyOut:parseInt(decimalToAmount(receive.value.coinY, coinYInfo.value.decimals))
  })
  store.commit(MutationType.SetShowPromtRemoveModal, true)  
}

const handleMax = ()=>{
  tokenAmount.value = maxTxt.value
  const xAmount = toFixed(amountToDecimal(lpData.value.share * reserveData.value.x, coinXInfo.value.decimals))  
  const yAmount = toFixed(amountToDecimal(lpData.value.share * reserveData.value.y, coinYInfo.value.decimals))

  receive.value = {
    coinX : xAmount,
    coinY : yAmount
  }
  
}

const onlyForCurrency = ($event)=>{
    let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
    // only allow number and one dot
    if ((keyCode < 48 || keyCode > 57) && (keyCode !== 46 || tokenAmount.value.indexOf('.') != -1)) { // 46 is dot
      $event.preventDefault();
    }
    // 0.
    // restrict to 2 decimal places
    // if(tokenAmount.value != null && tokenAmount.value.indexOf(".") > -1 && (tokenAmount.value.split('.')[1].length > 1)){
    //   $event.preventDefault();
    // }
  }


  if(coinX && coinY){
    coinXInfo.value = getCoinInfo(coinX)
    coinYInfo.value = getCoinInfo(coinY)
  }

  watch(() => store.state.address, (address) => {
    if(address){
      getOutInfo(coinX, coinY)
    }
  }, {immediate:true} )


const handleInput = (e)=>{  
  tokenAmount.value = e.target.value
  
  const xAmount = toFixed(amountToDecimal(lpData.value.share * reserveData.value.x, lpData.value.decimals) * (e.target.value / maxTxt.value))
  
  const yAmount = toFixed(amountToDecimal(lpData.value.share * reserveData.value.y, lpData.value.decimals) * (e.target.value / maxTxt.value))

  receive.value = {
    coinX : xAmount,
    coinY : yAmount
  }

  if(e.target.value > maxTxt.value){
    isMoreThanLp.value = true
  }else{
    isMoreThanLp.value = false
  }
}

</script>

<style lang="scss">

.remove {
  &__page {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 44px 0 0;
    -webkit-box-align: center;
    align-items: center;
    flex: 1 1 0;
    z-index: 1;
    .remove__container{
      position: relative;
      max-width: 480px;  
      width: 100%;  
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px, rgb(0 0 0 / 4%) 0 16px 24px,
        rgb(0 0 0 / 1%) 0 24px 32px;
      border-radius: 24px;
      margin-top: 1rem;
      padding: 0 16px 16px;
    }    
  }
  &-block{
    box-sizing: border-box;
    
  }
  &-inner{
    padding: 16px;
    background: rgba(227, 197, 245, 0.1);
    border-radius: 12px;
     .inner-title{
      font-size: 16px;
      line-height: 32px;
      padding: 0 16px 14px; 
      .remove-title{
        font-size: 20px;
      }
      .max-quote{
        cursor: pointer;
        font-size: 12px;
        .max-txt{
          color: #8B54FF;
          padding-left: 4px;
          font-size: 14px;
        }
      }
    }
    
      .main-input{
          background: rgba(227, 197, 245, 0.15);
          border-radius: 12px;
          display: flex;
          flex-flow: row nowrap;
          -webkit-box-align: center;
          align-items: center;
          -webkit-box-pack: justify;
          justify-content: space-between;
          padding: 23px 16px;
      .input-comp{
          filter: none;
          opacity: 1;
          height: 26px;
          color: rgb(255, 255, 255);
          width: 0;          
          position: relative;
          font-weight: 500;
          outline: none;        
          border: none;
          flex: 1 1 auto;
          background-color: transparent;
          font-size: 24px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0;
          appearance: textfield;
          &::placeholder {
            color: rgb(178, 185, 210);
          }
      }
    }
    .receive-title{
      line-height: 32px;
      padding: 16px;
      font-size: 20px;
    }
    .out-block{
      background: rgba(227, 197, 245, 0.15);
      border-radius: 12px;  
      padding: 24px 16px;
      .coin-out{
        line-height: 24px;
        .coin-amount{
          font-size: 24px;
        }
        .coin-logo{
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        .coin-symbol{
         font-size: 16px; 
         padding-left: 6px;
        }
        & + .coin-out{
          margin-top: 32px;
        }

      }
    }
  }
  
}

.my-position{
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  border-radius: 24px;
  padding: 32px;
  width: 480px;
  font-size: 16px;
  box-sizing: border-box;
  margin-top: 16px;
 .posision-title {
   padding-bottom: 21px;
 }
 .position-info{

 }
  .info-img{
    width: 24px;
    height: 24px;
    border-radius: 50%;
    & + .info-img{
      position: relative;
      left: -12px;
    }
  }
  .info-txt{

  }
  .position-item{
    padding-top: 16px;
    
  }
}


</style>