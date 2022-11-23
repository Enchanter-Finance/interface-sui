<template>
  <vue-modal
    :show="show"
    @close="closeConnectModal"
    title="Connect to a wallet"
    class="modal__wallet"
  >
    <ul class="wallet__list">
      <li
        v-for="(wallet, idx) in walletsList"
        :key="idx"
        :class="['wallet__list__item', wallet.isConnected ? 'active' : null]"
        @click="connectWallet(wallet)"
      >
        <div class="wallet__list__title">
          <div class="color-indicator" v-if="wallet.isConnected"></div>
          {{ wallet.title }}
        </div>
        <div class="wallet__list__logo">
          <img :src="getImgUrl(wallet.logo)" :alt="wallet.title" />
        </div>
      </li>
    </ul>
  </vue-modal>
</template>

<script>
import { toRefs, reactive, computed } from "vue"
import VueModal from "@/components/modal/VueModal.vue"
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import EnchanterWallet from '@/utils/wallet.js'
import { ActionTypes } from "@/store/actions"

export default {
  name: "VueModalConnectWallet",
  components: { VueModal },
  props: {
    show: { type: Boolean, default: false },
  },
  setup() {
    
    const getImgUrl = (logo) => new URL(`../../../assets/images/${logo}`, import.meta.url).href;
    
    const store = useStore()

    const walletsList = computed(() => store.state.walletList)

    const closeConnectModal = () => {
      store.commit(MutationType.SetConnectModal, false)
    }

    const connectWallet = async (wallet) => {     
      if(!wallet.isInstalled) return window.open(wallet.href, '_blank');
      const walletInstance = new EnchanterWallet()
      let response = await walletInstance.doConnect(wallet.name)
      const address = response?.address
      if(!address) return
      store.commit(MutationType.SetWallet, {
        address,
        wallet:wallet.name
      })
      store.dispatch(ActionTypes.GetTokenBalance)
      store.dispatch(ActionTypes.onNetworkChange)  
      closeConnectModal()
    }
    return {
      closeConnectModal,
      connectWallet,
      walletsList,
      getImgUrl
    }
  },
}
</script>

<style lang="scss">
.modal {
  &__wallet {
    &__info {
      border: 1px solid rgb(44, 47, 54);
      background-color: rgb(33, 36, 41);
      width: 100%;
      padding: 1rem;
      border-radius: 16px;
      box-sizing: border-box;
      margin: 0 0 16px 0;
      min-width: 0;
      font-size: 14px;
      font-weight: 500;
      color: rgb(195, 197, 203);
    }
    
  }
}
.wallet {
  &__list {
    display: grid;
    gap: 8px;
    padding: 0;
    margin: 0;
    &__item {
      margin-top: 0;
      opacity: 1;
      display: flex;
      flex-direction: row;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: justify;
      justify-content: space-between;
      padding: 1rem;
      line-height: 56px;
      height: 56px;
      box-sizing: border-box;
      background: #4C3C70;
      outline: none;
      border-radius: 12px;
      width: 100%;
      border: 2px solid #4C3C70;
      &:hover {
        cursor: pointer;
        border: 2px solid #8B54FF;
      }

      &.active {
        background-color: rgb(64, 68, 79);        
        padding: 1rem;
        outline: none;
        border: 1px solid transparent;
        border-radius: 12px;
        width: 100% !important;
      }
    }
    &__title {
      color: rgb(255, 255, 255);
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      > .color-indicator {
        width: 8px;
        height: 8px;
        margin-right: 8px;
        background-color: rgb(39, 174, 96);
        border-radius: 50%;
      }
    }
    &__logo {
      display: flex;
      flex-flow: column nowrap;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;

      > img {
        width: 24px;
        height: 24px;
        /* border-radius:50%; */
      }
    }
  }
}
</style>
