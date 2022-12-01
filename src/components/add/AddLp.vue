<template>  
  <main class="add">
    <add-header></add-header>
    <vue-row class="add__currency">
      <vue-column :span="12" class="flex--column">
        <add-currency-panel
          :is-selected="!!selectedTokenTop.symbol"
          :token="selectedTokenTop"
          position="top"
        ></add-currency-panel>
        <div class="add__currency__switch">
          <VueIconAdd/>
        </div>
        <add-currency-panel
          :is-selected="!!selectedTokenBottom.symbol"
          :token="selectedTokenBottom"
          position="bottom"
        ></add-currency-panel>
      </vue-column>
      <div v-if="isFilledNumberBothPostion" class="supply-area">
        <SupplyInfo/>
      </div>
      <vue-column style="margin-top:8px;">
        <vue-button v-if="!isAuthWallet" :span="12" look="main" size="lg" @handleClick="openConnectModal"> Connect Wallet </vue-button>
        <vue-button v-else-if="isNotTestNetWork" :span="12" look="disabled" size="lg"> Please Switch to Testnet </vue-button>
        <vue-button v-else-if="buttonSelectWarningType" :span="12" look="disabled" size="lg"> Invalid pair </vue-button>

        <vue-button v-else-if="isNotExistsPair" :span="12" look="disabled" size="lg"> Liquidity not exists </vue-button>  

        <vue-button v-else-if="buttonInputWarningType" :span="12" look="disabled" size="lg"> Enter an amount </vue-button>
        <vue-button v-else-if="buttonInputInsufficient" :span="12" look="disabled" disabled size="lg"> {{InsufficientText}}</vue-button>        
        <vue-button v-else-if="isFilledNumberBothPostion" :span="12" look="main" size="lg" @handleClick="handleSupply" class="cursor-pointer"> Supply </vue-button>
      </vue-column>
    </vue-row>
  </main>  
</template>

<script setup>
import { computed, onBeforeUnmount } from "vue"
import VueButton from "@/components/button/VueButton.vue"
import AddHeader from "./AddHeader.vue"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router';
import VueIconAdd from "@/components/icons/VueIconAdd.vue"
import { MutationType } from "@/store/mutations"
import { ActionTypes } from "@/store/actions"
import VueRow from "@/components/layout/VueRow/VueRow.vue"
import VueColumn from "@/components/layout/VueColumn/VueColumn.vue"
import AddCurrencyPanel from "@/components/add/AddCurrencyPanel.vue"
import SupplyInfo from "@/components/add/SupplyInfo.vue"
import { CELER_COIN_ADDRESS } from '@/libs/enchanter.ts'
import { localStorage } from "@/utils/localStorage";

const store = useStore()
const router = useRoute();
const { coinX, coinY } = router.params  

const tokenList = computed(() => store.state.tokenList)

const getCoinInfo = (address)=>{
  return tokenList.value.find(_ => _.address === address)
}

const getAllPools = async()=>{
  const list = await window.SDK.getAllPools()
  localStorage.set('allPools', list.coinsArr || [])
}

getAllPools()

if(coinX && coinY){
  const coinXInfo = getCoinInfo(coinX)
  const coinYInfo = getCoinInfo(coinY)
  store.commit(MutationType.SetSelectTokenTop, {
    ...coinXInfo,
    value: ''
  })
  store.commit(MutationType.SetSelectTokenBottom, {
    ...coinYInfo,
    value: ''
  })

  store.dispatch(ActionTypes.GetLpReserveData)
  
}
let selectedTokenTop = computed(() => store.state.selectedTokenTop)

let isNotTestNetWork = computed(() => store.state.netWork !== 'Testnet')

let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)

let buttonSelectWarningType = computed(() => !selectedTokenTop.value.symbol || !selectedTokenBottom.value.symbol)

let isNotExistsPair = computed(() => store.getters.isNotExistsPair)

let buttonInputWarningType = computed(() => !(selectedTokenTop.value.value > 0 && selectedTokenBottom.value.value > 0))

let buttonInputInsufficient = computed(() => selectedTokenTop.value.value > selectedTokenTop.value.balance || selectedTokenBottom.value.value > selectedTokenBottom.value.balance)

let InsufficientText = computed(() => {
    if(selectedTokenTop.value.value > selectedTokenTop.value.balance){
      return `Insufficient ${selectedTokenTop.value.symbol} balance`
    }else if(selectedTokenBottom.value.value > selectedTokenBottom.value.balance){
      return `Insufficient ${selectedTokenBottom.value.symbol} balance`
    }
  }
)

let buttonBalanceType = computed(() => selectedTokenTop.value && 100 > 90)

const isAuthWallet = computed(() => store.state.isAuthWallet)

const address = computed(() => store.state.address)

let isFilledNumberBothPostion = computed(() => store.getters.isFilledNumberBothPostion)

const openConnectModal = () => {
  store.commit(MutationType.SetConnectModal, true)
  store.commit(MutationType.ResetWalletList)  
}
const handleSupply= async(e)=>{
  store.commit(MutationType.SetShowPromtAddModal, true)  
}

onBeforeUnmount(() => {
  store.commit(MutationType.SetBasedPosition, null)
  store.commit(MutationType.SetSelectTokenTopValue, "");
  store.commit(MutationType.SetSelectTokenBottomValue, "");
})


</script>


<style lang="scss">
.add {
  position: relative;
  max-width: 480px;  
  width: 100%;  
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px, rgb(0 0 0 / 4%) 0 16px 24px,
    rgb(0 0 0 / 1%) 0 24px 32px;
  border-radius: 24px;
  margin-top: 1rem;
  
  &__currency {
    &.row {
      position: relative;
      padding: 20px;
      display: grid;
      grid-auto-rows: auto;
      row-gap: 8px;
    }

    &__switch {
      height: 56px;
      display: flex;
      justify-content: center;
      align-items: center;      
      margin: 12px 0;      
    }
  }
}
.supply-area{
  padding-top: 8px;
}
</style>
