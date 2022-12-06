<template>
  <div class="navbar__options flex align--center">
    <div v-if="isAuthWallet" class="request__token-btn" :class="{'requestLoading':requestLoading}" @click="handleRequest">
      <VueIconCIrcle v-if="requestLoading" class="loading-svg"/>
      <span class="request-txt">Request $SUI</span>
    </div>
    <div class="options__account--wrapper flex align--center" v-if="isAuthWallet" @click="openAccount">
      <div class="account-balance">
        {{formatDecimalsNum(aptBalance)}}SUI
      </div>
      <div class="options__account">
        <img v-if="isAuthWallet === 'aptos'" class="options__account--avatar" src="../../../assets/images/petra_logo.png" alt="">
        <img v-else-if="isAuthWallet === 'martian'" class="options__account--avatar" src="../../../assets/images/martian_logo.png" alt="">
        <img v-else-if="isAuthWallet === 'fewcha'" class="options__account--avatar" src="../../../assets/images/fewcha_logo.png" alt="">
        <img v-else-if="isAuthWallet === 'Crypto.com'" class="options__account--avatar" src="../../../assets/images/cryptocom_logo.png" alt="">
        <span class="options__account--address">{{masacAddr}}</span>        
      </div>
    </div>
    

    <div @click="openConnectModal" class="options__connect" v-else>Connect Wallet</div>
    <div class="options__menu" @click="moreOpen = true" @mouseenter="moreOpen = true" >
      <svg width="24" height="4" viewBox="0 0 24 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="2" cy="1.99951" r="2" fill="white"/>
        <circle cx="11.9995" cy="1.99951" r="2" fill="white"/>
        <circle cx="22.0005" cy="1.99951" r="2" fill="white"/>
      </svg>      
      <div v-if="moreOpen" class="more-menu" @mouseleave="moreOpen = false">
        <div @click="toLink('About')" class="more-memu--item"><span>About</span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="7" cy="7" r="6.5" stroke="white"/><rect x="6" y="3" width="2" height="2" rx="1" fill="white"/><rect x="6" y="6" width="2" height="5" rx="1" fill="white"/></svg></div>
        <div @click="toLink('Twitter')" class="more-memu--item"><span>Twitter</span><svg width="17" height="14" viewBox="0 0 17 14" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M16.2105 1.66291C15.6053 1.94441 14.9597 2.1291 14.2972 2.21022C15.0018 1.75693 15.5205 1.06586 15.759 0.262565C15.1136 0.671874 14.3993 0.960892 13.6509 1.11562C13.3494 0.766982 12.9767 0.487013 12.5579 0.294574C12.1391 0.102135 11.684 0.00168835 11.2231 0C9.38216 0 7.90168 1.5859 7.90168 3.53355C7.90348 3.80547 7.93083 4.07662 7.98335 4.34343C5.22657 4.19056 2.76844 2.7902 1.13397 0.646499C0.834741 1.19295 0.679374 1.80656 0.682484 2.42961C0.676797 3.00271 0.808208 3.56885 1.06574 4.08082C1.32328 4.59278 1.69949 5.03572 2.16296 5.37268C1.6325 5.35039 1.11599 5.19597 0.660324 4.9234V4.96658C0.660324 6.68434 1.80246 8.10802 3.32377 8.43477C3.03863 8.51262 2.74435 8.55186 2.44878 8.55147C2.23889 8.54964 2.02945 8.5317 1.8223 8.49779C2.24229 9.89814 3.46843 10.9146 4.92673 10.9484C3.77276 11.9219 2.31225 12.4567 0.802652 12.4584C0.534466 12.4607 0.2664 12.4462 0 12.4153C1.50155 13.4477 3.28083 14.0002 5.1029 14C11.2114 14 14.5527 8.61799 14.5527 3.94666C14.5527 3.79379 14.5527 3.63974 14.5422 3.48687C15.1965 2.97657 15.7604 2.36001 16.2105 1.66291Z"/></svg></div>
        <div @click="toLink('Discord')" class="more-memu--item"><span>Discord</span><svg width="17" height="12" viewBox="0 0 17 12" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M10.7415 10.44C10.5244 10.4945 10.3073 10.5491 10.0793 10.5818C8.87708 10.8108 7.64276 10.8108 6.44054 10.5818C6.22886 10.5382 5.9108 10.4727 5.54497 10.3636L4.28466 12C1.18108 11.9029 0 9.80509 0 9.80509C0.0466391 6.91549 0.738125 4.07326 2.02346 1.488C3.15382 0.589811 4.53547 0.0695085 5.97484 0L6.5046 0.714551H6.65983C7.71426 0.572739 8.78279 0.572739 9.83722 0.714551L10.4473 0C11.8873 0.0735869 13.2685 0.597655 14.3976 1.49891C15.6828 4.08033 16.3743 6.91899 16.4211 9.80509C16.4211 9.80509 15.227 11.8778 12.1201 11.9869L10.7415 10.44ZM5.4983 5.57563C5.23461 5.59642 4.98269 5.69402 4.77334 5.85647C4.564 6.01893 4.40631 6.23921 4.31962 6.49032C4.23292 6.74144 4.22098 7.01251 4.28522 7.27035C4.34946 7.52819 4.48711 7.76161 4.68133 7.94205C4.87554 8.12249 5.11787 8.24212 5.37869 8.28627C5.63951 8.33043 5.90749 8.29722 6.14981 8.19069C6.39213 8.08416 6.59828 7.90894 6.74304 7.68649C6.8878 7.46403 6.9649 7.20398 6.96487 6.93818C6.94906 6.56245 6.78595 6.20828 6.51117 5.95299C6.23639 5.6977 5.87227 5.56204 5.4983 5.57563ZM10.7523 5.57563C10.489 5.59746 10.2377 5.69591 10.0291 5.85894C9.82049 6.02197 9.6637 6.24252 9.57782 6.49365C9.49193 6.74478 9.48069 7.01563 9.54548 7.27307C9.61027 7.53051 9.74826 7.76342 9.94262 7.94333C10.137 8.12324 10.3793 8.24235 10.6399 8.28613C10.9005 8.3299 11.1682 8.29645 11.4102 8.18983C11.6522 8.08322 11.8581 7.90807 12.0027 7.6858C12.1473 7.46352 12.2243 7.20373 12.2243 6.93818C12.2083 6.56157 12.0443 6.20672 11.7684 5.95134C11.4925 5.69596 11.1271 5.56086 10.7523 5.57563Z"/></svg></div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { computed,  ref } from "vue"
import VueButton from "@/components/button/VueButton.vue"
import VueIconCIrcle from "@/components/icons/VueIconCIrcle.vue"
import VueIconDotsHorizontal from "@/components/icons/VueIconDotsHorizontal.vue"
import { useStore } from 'vuex'
import { masacAddress, formatDecimalsNum } from '@/utils/index'
import { MutationType } from "@/store/mutations"
export default {
  name: "NavOptions",
  components: { VueIconDotsHorizontal, VueButton, VueIconCIrcle },
  setup() {
    const moreOpen = ref(false)
    const requestLoading = ref(false)
    const store = useStore()    
    const isAuthWallet = computed(() => store.state.isAuthWallet)    
    const address = computed(() => store.state.address)
    
    const aptBalance = computed(() => store.state.aptBalance)    

    const masacAddr = computed(() => masacAddress(store.state.address))

    const openConnectModal = () => {
      store.commit(MutationType.SetConnectModal, true)
      store.commit(MutationType.ResetWalletList)  
    }
    const openAccount = () => {
      store.commit(MutationType.SetAccountModal, true)
    }
    const handleRequest = () => {      
      requestLoading.value = true            
      window.suiSDK.handleRequest(address.value).
      then(res=>{
        store.commit(MutationType.SetshowToast, '0.05 SUI sent to your wallet!')
      }).catch(err=>{
        store.commit(MutationType.SetshowToast, 'SUI received failed')
      }).finally(()=>{
        requestLoading.value = false
      })
    }
    const toLink = (link) => {      
      const linkMap = {        
        'About':'https://www.enchanter.fi/',
        'Twitter':'https://twitter.com/EnchanterFi',
        'Discord':'https://discord.gg/kAxTRj6YBt'
      }
      window.open( linkMap[link], '_blank');      
    }
    

    return { address, openConnectModal, isAuthWallet, moreOpen, openAccount, toLink, requestLoading, handleRequest, aptBalance, masacAddr, formatDecimalsNum }
  },
}
</script>

<style lang="scss">
.request__token-btn{  
  padding: 0 18px;
  height: 48px;
  line-height: 48px;
  background: #8B54FF;
  border-radius: 24px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  @media screen and (max-width: 650px) {   
    display: none;
  }
  &.requestLoading{
    background: #5D34B4;
    cursor: auto;
  }
  .loading-svg{
    margin-top: 2px;
  }
  &:hover{
    background: #5D34B4;
  }
  .request-txt{
    padding-left: 6px;
    
  }
}
.options__account--wrapper{
  background: #281C4D;
  border-radius: 24px;  
  padding: 4px;
  .account-balance{
    padding: 0 8px 0 12px;
  }
}
.options {
  &__connect{
    text-align: center;
    line-height: 48px;
    border-radius: 24px;
    width: 177px;
    background: #8B54FF;
    font-weight: 500;
    font-size: 16px;    
    cursor: pointer;
    &:hover{
      background: #5D34B4;
    }
  }
  &__account{    
    line-height: 38px;
    height: 38px;
    border-radius: 20px;
    background: #3C2970;
    font-weight: 500;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding-right: 6px;
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid #3C2970;
    &:hover{
      // background: #5D34B4;
      border: 2px solid #8B54FF;
    }
    &--avatar{
      margin-left: 5px;
      margin-right: 3px;
      width: 30px;
      height: 30px;
      /* border-radius:50%; */
    }
  }
  &__menu{
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #3C2970;
    margin-left: 16px;
    cursor: pointer;
    position: relative;    
  }
  
  &__wallet-content {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0.5rem 0 0.25rem;
    font-size: 1rem;
    width: fit-content;
    font-weight: 500;
  }
  
}
.more-menu {
  position: absolute;
  z-index: 100;
  top: 56px;
  right: 0;  
  width: 112px;
  box-sizing: border-box;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);  
  padding: 8px 0;
  cursor: pointer;
  .more-memu--item{
    color: #fff;
    font-size: 16px;
    line-height: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 14px;
    &:nth-child(1) svg{
      margin-right: 2px;
    }
    &:hover{
      span{
        color: #BA99FF;
      }      
      svg{
        fill: #BA99FF;
      }
    }
  }
}
</style>
