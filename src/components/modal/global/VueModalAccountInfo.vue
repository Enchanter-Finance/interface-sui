<template>
  <vue-modal
    :show="show"
    @close="closeAccountModal"
    title="Account"
    class="modal__account"
  >
  <div class="account-info">
    <div class="account-info--top flex justify--space-between align--center">
      <span class="disconnect-txt">Connected with {{walletName}}</span>
      <div class="disconnect-button cursor-pointer" @click="handleDisconnect">Disconnect</div>
    </div>
    <div class="account-info--center flex align--center">
      <!-- <svg class="" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="15.5" fill="#24004F" stroke="#A5A1FF"/><path d="M16 32C16 29.8991 15.5861 27.8189 14.7821 25.8779C13.978 23.937 12.7994 22.1734 11.3137 20.6878C9.82797 19.2023 8.06414 18.0239 6.12294 17.22C4.18173 16.416 2.10115 16.0022 0 16.0022C2.10144 16.0019 4.18224 15.5878 6.12361 14.7834C8.06497 13.9791 9.82889 12.8003 11.3146 11.3144C12.8004 9.82841 13.9788 8.06442 14.7827 6.1231C15.5867 4.18178 16.0003 2.10115 16 0C16 4.24288 17.6857 8.31198 20.6863 11.3122C23.6869 14.3123 27.7565 15.9978 32 15.9978C29.8984 15.9975 27.8173 16.4113 25.8757 17.2154C23.9341 18.0195 22.1699 19.1983 20.6841 20.6844C19.1982 22.1704 18.0198 23.9346 17.2161 25.8762C16.4124 27.8178 15.9991 29.8987 16 32Z" fill="white"/></svg> -->
      <img v-if="isAuthWallet === 'aptos'" class="wallet_logo" src="../../../assets/images/petra_logo.png" alt="">
      <img v-else-if="isAuthWallet === 'martian'" class="wallet_logo" src="../../../assets/images/martian_logo.png" alt="">
      <img v-else-if="isAuthWallet === 'fewcha'" class="wallet_logo" src="../../../assets/images/fewcha_logo.png" alt="">
      <img v-else-if="isAuthWallet === 'Crypto.com'" class="wallet_logo" src="../../../assets/images/cryptocom.png" alt="">
      <span class="account-info-address">{{masacAddress(address)}}</span>
    </div>
    <div class="account-info--bot flex align--center">
      <div 
        class="bot-copy flex align--center cursor-pointer"  
        v-clipboard:copy="address"
        v-clipboard:success="onSuccess"
      >      
        <svg v-if="copied" width="16" height="16" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="5.5" cy="5.5" r="4.5" stroke="#AC85FF"/><path d="M3 5L5 7L8 4" stroke="#AC85FF"/></svg>
        
        <!-- <svg  width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.71429 3H10C10.5523 3 11 3.44772 11 4V10C11 10.5523 10.5523 11 10 11H4C3.44772 11 3 10.5523 3 10V8.71429" stroke="white" stroke-width="1.2" stroke-linejoin="round"/><rect x="1" y="1" width="8" height="8" rx="1" stroke="white"/></svg> -->
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="9" height="9" rx="1" stroke="#ECECEC"/>
          <path d="M11 6H14C14.5523 6 15 6.44772 15 7V14C15 14.5523 14.5523 15 14 15H7C6.44772 15 6 14.5523 6 14V11" stroke="white"/>
        </svg>

        <span :class="{'copied':copied}">{{copied ? 'Copied to Clipboard' : 'Copy Address'}}</span>
      </div>
      <div class="bot-explorer flex align--center cursor-pointer" @click="openExplorer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 10V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H7" stroke="white" stroke-linecap="round"/>
          <path d="M14 6V2.5C14 2.22386 13.7761 2 13.5 2H10" stroke="white" stroke-linecap="round"/>
          <path d="M13.6569 2.34315L8 8" stroke="white" stroke-linecap="round"/>
        </svg>
        <span>View on Explorer</span>
      </div>
    </div>
  </div>
  </vue-modal>
</template>

<script setup>
import {  ref, reactive, computed, onBeforeUnmount } from "vue"
import VueModal from "@/components/modal/VueModal.vue"
import { MutationType } from "@/store/mutations"
import { useStore } from 'vuex'
import EnchanterWallet from '@/utils/wallet.js'
import { masacAddress } from '@/utils/index'
import { localStorage } from "@/utils/localStorage";
defineProps({
  show:Boolean
})
const store = useStore()
const copied = ref(false)
let timer = null;



const address = computed(() => store.state.address)

const isAuthWallet = computed(() => store.state.isAuthWallet)

const walletName = computed(() => store.state.isAuthWallet.toUpperCase())

const closeAccountModal = ()=> store.commit(MutationType.SetAccountModal, false)

const handleDisconnect = async ()=> {
  const walletInstance = new EnchanterWallet()
  await walletInstance.disConnect(store.state.isAuthWallet)
  localStorage.set('localWallet', '')
  closeAccountModal()
  store.commit(MutationType.ResetWalletList)
  store.commit(MutationType.SetConnectModal, true)
  const response = await walletInstance.initLogin()
  store.commit(MutationType.SetWallet, response)
  store.commit(MutationType.SetBalanceLoaded, false)
}

const onSuccess = ()=>{  
  copied.value = true
  timer = setTimeout(() => {
    copied.value = false
  }, 500);
}
const openExplorer = ()=>{  
  window.open(`https://explorer.aptoslabs.com/account/${address.value}?network=testnet`, '_blank');    
}
onBeforeUnmount(() => {
  clearTimeout(timer);
  timer = null
})
</script>

<style lang="scss">
.account-info{
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 16px;
  color: #fff;
  font-size: 14px;
  &--top{
    .disconnect-txt{
      align-items: center;
    }
    .disconnect-button{
      width: 96px;
      height: 23px;
      line-height: 23px;
      border-radius: 13px;
      padding: 0 12px;
      box-sizing: border-box;
      border: 1px solid #8B54FF;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        color: #8B54FF;
      }
    }
  }
  &--center{
    padding: 15px 0 17px;
   .account-info-address {
     padding-left: 8px;     
     font-size: 22px;
   }
   .wallet_logo{
     width: 24px;
     height: 24px;
     margin-top: 2px;
     /* border-radius: 50%; */
   }
  }
  &--bot{
    line-height: 1;
    span{
      padding-left: 6px;
    }
    .bot-copy{
      .copied{
        color: #AC85FF;
      }
    }
    .bot-explorer{
      margin-left: 10px;
    }
  }
}
</style>