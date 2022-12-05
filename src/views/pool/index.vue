<template>
  <div class="pool__page">
    <div class="pools_container">
      <div class="pools_container--title flex justify--space-between align--center">
        <span>Pools Overview</span>
        <div class="flex align--center">
          <div @click="addPosition" class="pools_container-create--button cursor-pointer">Create Pools</div>
          <div @click="addPosition" class="pools_container-add--button cursor-pointer">+ New Position</div>
        </div>        
      </div>
      <div class="pools_container--list" :class="{'fix-container-width':list.length && isAuthWallet, 'flex align--end':!isAuthWallet}">
        <div class="position-inner flex flex--column justify--end align--center container-fullfiled" v-if="!isAuthWallet">
          <div class="inner-txt">Connect wallet to</div>
          <div class="inner-txt">view your liquidity positions</div>
          <vue-button look="main" size="lg" @click="openConnectModal"> Connect Wallet </vue-button>
        </div>
        <div v-else-if="!list.length" class="container-fullfiled flex justify--center align--center" style="height:320px">
          No Position found
        </div>
        <div v-else-if="list.length" class="pool_list">
          <div class="pool_list--title flex justify--space-between align--center">
            <svg class="back-icon" @click="backPage" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            <span>Your liquidity</span>
            <div></div>
          </div>   
          <div class="pool_list-wrapper">
            <div class="pool_list--item" :class="{'isCollapes':item.isCollapes}" v-for="(item, index) in list" :key="index">
              <div class="pool_list--item-inner flex justify--space-between align--center cursor-pointer">
                <div class="pair-info flex justify--space-between align--center">
                  <img class="pair-img" v-for="item in item.pairsImg" :key="item.id" :src="getImgUrl(item)"/>
                  <span class="pair-txt">{{item.pairsName[0]}}/{{item.pairsName[1]}}</span>
                </div>
                <div class="manage-block flex justify--space-between align--center" @click="toggleCollapse(index)">
                  <span class="manage-txt">Manage</span>
                  <VueIconArrowDown class="manage-arrow" :isActive="item.isCollapes"/>
                </div>
              </div>
              <div v-if="item.isCollapes" class="slide-content">
                <div class="slide-content-item flex justify--space-between align--center">
                  <span>Your total pool tokens:</span>
                  <span>{{item.lpDecimalAmount}}</span>
                </div>
                <div class="slide-content-item flex justify--space-between align--center">
                  <span>Pooled {{item.pairsName[0]}}:</span>
                  <div class="flex align--center">
                    <span>{{formatDecimalsNum(item.showCoinXAmount)}}</span>
                    <img class="right-icon" :src="getImgUrl(item.pairsImg[0])" alt="">
                  </div>
                </div>
                <div class="slide-content-item flex justify--space-between align--center">
                  <span>Pooled {{item.pairsName[1]}}:</span>
                  <div class="flex align--center">
                    <span>{{formatDecimalsNum(item.showCoinYAmount)}}</span>
                    <img class="right-icon" :src="getImgUrl(item.pairsImg[1])" alt="">
                  </div>
                </div>
                <div class="slide-content-item flex justify--space-between align--center">
                  <span>Your pool share:</span>
                  <span>{{item.showShare}}</span>
                </div>
                <div class="manage-btns flex justify--space-between">
                  <div @click="toAdd(item)" class="common-btn add-btn">Add</div>
                  <div class="common-btn remove-btn" @click="handleRemove(item)">Remove</div>
                </div>
              </div>            
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>  
</template>

<script setup>
import {computed, ref, onBeforeUnmount, onMounted, watch, watchEffect, reactive} from "vue"
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import VueButton from "@/components/button/VueButton.vue"
import VueTooltip from "@/components/tooltip/VueTooltip.vue"
import VueIconArrowDown from "@/components/icons/VueIconArrowDown.vue"
import { toFixed } from '@/utils/index'
import { formatDecimalsNum, amountToDecimal } from '@/utils/index'
const router = useRouter();
const getImgUrl = (logo) => new URL(`../../assets/images/${logo  || "default_token_logo.png" }`, import.meta.url).href;
const isAuthWallet = computed(() => store.state.isAuthWallet)
const store = useStore()
let list = reactive([])
const address = computed(() => store.state.address)

// const createPosition = ()=>{
//   store.commit(MutationType.setIsAddOrCreate, 'create')
//   router.push({ path: '/add' })
// }
const addPosition = ()=>{
  // store.commit(MutationType.setIsAddOrCreate, 'add')
  router.push({ path: '/add' })
}

const backPage = ()=>{
  router.push({ path: '/' })
}


const openConnectModal = () => {
  store.commit(MutationType.SetConnectModal, true)  
  store.commit(MutationType.ResetWalletList)
}

const toAdd = (item) => {
  const [coinX, coinY] = item.pairsInfo
  router.push({ path: `/add/${coinX.address}/${coinY.address}`})  
}

const toggleCollapse = (idx)=>{
  list[idx].isCollapes = !list[idx].isCollapes  
}

const tokenList = computed(() => store.state.tokenList)

const getCoinInfo = (address)=>{
  return tokenList.value.find(_ => _.address === address)
}

const getPairCoins = async() => {
   for (let i = 0; i < list.length; i++) {
    const { pairsInfo, share, decimals } = list[i]
    const reserveData = await window.suiSDK.getReserveData(pairsInfo[0].address, pairsInfo[1].address);
    
    const x = toFixed(amountToDecimal(share * reserveData.x, decimals))
    const y = toFixed(amountToDecimal(share * reserveData.y, decimals))
    list[i].outCoinX = x
    list[i].outCoinY = y

    list[i].showCoinXAmount = +x
    list[i].showCoinYAmount = +y

  }
}
const getPoolList = async() => {
  let myPool = await window.suiSDK.getUserLPList(address.value)  
  const pools = myPool.map(({
    pairs,
    lpAmount,
    decimals,    
    share
  })=>{
    let pairsInfo = pairs.map(_ => getCoinInfo(_))
    const percentage = share * 100
    let showShare = percentage < 0.01 ? `<${0.01}%` : `${percentage.toFixed(5)}%`
    return {      
      isCollapes:false,
      pairsInfo,
      pairsImg:[pairsInfo[0].logo, pairsInfo[1].logo],
      pairsName:[pairsInfo[0].symbol, pairsInfo[1].symbol],
      outCoinX:0,
      outCoinY:0,
      lpAmount,
      decimals,
      lpDecimalAmount:toFixed(amountToDecimal(lpAmount, decimals)),
      share,
      showShare
    }
  })
  
  list.push(...pools)
  getPairCoins()
}

watch(() => store.state.address, (address) => {
  if(address){
    list.length = 0
    getPoolList()
  }
})

onMounted(async () => {   
  getPoolList()
})

const handleRemove = async (item) => {
  const [coinX, coinY] = item.pairsInfo
  router.push({ path: `/remove/${coinX.address}/${coinY.address}`})  

}


</script>

<style lang="scss">

.pool__page{
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 76px 16px 0;
  -webkit-box-align: center;
  align-items: center;
  flex: 1 1 0;
  z-index: 1;
  font-size: 18px;
  font-weight: 500;  
}
 .pools_container{
    max-width: 512px;
    width: 100%;   
    &--title{
      padding-left: 8px;     
      
    }
     &-create--button{
      text-align: center;
      width: 133px;
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      background: #3C2970; 
      border-radius: 18px;
      margin-right: 12px;
      &:hover{
        color: #8B54FF;
      }
    }  
    &-add--button{
      text-align: center;
      width: 150px;
      height: 36px;
      line-height: 36px;
      font-size: 16px;
      background: #8B54FF;    
      border-radius: 18px;
      &:hover{          
        background: #5D34B4;
      }
    }    
    &--list{
      min-height: 320px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px, rgb(0 0 0 / 4%) 0 16px 24px, rgb(0 0 0 / 1%) 0 24px 32px;
      border-radius: 24px;
      margin-top: 8px;
      padding: 16px;
      .inner-txt{
        line-height: 1;
        & + .inner-txt{
          padding-bottom: 88px;
          padding-top: 3px;
        }
      }
      &.fix-container-width{
        min-height: 409px;
        height: auto;
        padding: 0;
      }
      
  }
  .pool_list{
    padding: 16px;    
    .pool_list-wrapper{
      padding-top: 16px;
      min-height: 352px;
      box-sizing: border-box;
      // overflow-y: scroll;
    }
    &--title{
      .back-icon{
        cursor: pointer; 
        margin-left: 16px;
      }
    }
    &--item{
      padding: 23px 16px;
      border-radius: 16px;      
      background: rgba(227, 197, 245, 0.1);
      .pair-img{
        width: 24px;
        height: 24px;
        border-radius: 50%;
        & + .pair-img{
          position: relative;
          left: -12px;
        }
      }
      .manage-txt{
        color: #8B54FF;
        &:hover{
          text-decoration: underline;
        }        
      }
      .manage-arrow{
        margin-top:4px;
      }
      .slide-content{
        font-size: 18px;
        padding-top: 24px;
      }
      .slide-content-item{
        font-size: 16px;
        line-height: 40px;
        & + .slide-content-item{
          padding-top: 16px;
        }
        .right-icon{
          width: 16px;
          border-radius: 50%;
          margin-left: 6px;
        }
      }
      & + .pool_list--item{
        margin-top: 16px;
      }
    }
    .manage-btns{
      padding-top: 16px;
      .common-btn{
        font-weight: 500;
        text-align: center;
        border-radius: 8px;
        will-change: transform;
        transition: transform 450ms ease 0s;
        transform: perspective(1px) translateZ(0px);
        cursor: pointer;
        position: relative;
        z-index: 1;        
        height: 62px;
        line-height: 62px;  
        color: white;
      }
      .add-btn{
        background-color: #8B54FF;
        width: 216px;
        &:hover{          
          background: #5D34B4;
        }
      }
      .remove-btn{
        background-color: #8B54FF;        
        height: 62px;
        width: 216px;
        line-height: 62px;  
        &:hover{          
          background: #5D34B4;
        }       
      }
    }
  }
}  
</style>