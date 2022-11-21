<template>
  <div class="swap-title-container"></div>
  <main class="swap">
    <vue-swap-header></vue-swap-header>
    <vue-row class="swap__currency">
      <vue-column :span="12" class="flex--column">
        <vue-currency-panel
          :is-selected="!!selectedTokenTop.symbol"
          :token="selectedTokenTop"
          position="top"
        ></vue-currency-panel>
        <div class="swap__currency__switch" @click="swapCurrency">
          <VueArrowRouteDown />
        </div>
        <vue-currency-panel
          :is-selected="!!selectedTokenBottom.symbol"
          :token="selectedTokenBottom"
          position="bottom"
        ></vue-currency-panel>
      </vue-column>
      <vue-slide-info v-if="(isLoading || slideInfo) && slideInfoError"></vue-slide-info>
      <vue-column style="margin-top:8px;" :class="{'fix-wrapper':isLoading || slideInfo}">
        <vue-button v-if="!isAuthWallet" :span="12" look="main" size="lg" @handleClick="openConnectModal"> Connect Wallet </vue-button>
        <vue-button v-else-if="isNotTestNetWork" :span="12" look="disabled" disabled size="lg"> Please Switch to Testnet </vue-button>
        <vue-button v-else-if="buttonSelectWarningType" :span="12" look="disabled" disabled size="lg"> Select a token </vue-button>
        <vue-button v-else-if="isNotExistsPair" :span="12" look="disabled" disabled size="lg"> Liquidity not exists </vue-button>                
        <vue-button v-else-if="bigThanReserve" :span="12" look="disabled" disabled size="lg"> Insufficient liquidity for this trade.</vue-button>
        <vue-button v-else-if="buttonInputWarningType" :span="12" look="disabled" disabled size="lg"> Enter an amount </vue-button>
        <vue-button v-else-if="buttonInputInsufficient" :span="12" look="disabled" disabled size="lg"> Insufficient {{ selectedTokenTop.symbol }} balance </vue-button>
        <vue-button v-else-if="isFilledNumberBothPostion" :span="12" look="main" size="lg" @handleClick="showConfirmModal" class="cursor-pointer"> Swap </vue-button>
      </vue-column>
    </vue-row>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, nextTick } from "vue";
import VueButton from "@/components/button/VueButton.vue";
import VueSwapHeader from "./VueSwapHeader.vue";
import VueSlideInfo from "./VueSlideInfo.vue";
import { useStore } from "vuex";
import { MutationType } from "@/store/mutations";
import { ActionTypes } from "@/store/actions";
import VueRow from "@/components/layout/VueRow/VueRow.vue";
import VueColumn from "@/components/layout/VueColumn/VueColumn.vue";
import VueCurrencyPanel from "@/components/swap/VueCurrencyPanel.vue";
import VueArrowRouteDown from "@/components/icons/VueArrowRouteDown.vue";
import { CELER_COIN_ADDRESS } from "@/libs/enchanter.ts";
import { amountToDecimal, decimalToAmount } from '@/utils/index'
const store = useStore();

let selectedTokenTop = computed(() => store.state.selectedTokenTop);

let selectedTokenBottom = computed(() => store.state.selectedTokenBottom);

let basedPosition = computed(() => store.state.basedPosition);

let isFilledNumberBothPostion = computed(
  () => store.getters.isFilledNumberBothPostion
);

let isNotTestNetWork = computed(() => store.state.netWork !== "Testnet");

let buttonSelectWarningType = computed(
  () => !selectedTokenTop.value.symbol || !selectedTokenBottom.value.symbol
);

let buttonInputWarningType = computed(
  () =>
    !(
      selectedTokenTop.value.value > 0 && selectedTokenBottom.value.value > 0
    ) || selectedTokenTop.value.value < amountToDecimal(1, selectedTokenTop.value.decimals)
);

let buttonInputInsufficient = computed(
  () => selectedTokenTop.value.value > selectedTokenTop.value.balance
);

let buttonBalanceType = computed(() => selectedTokenTop.value && 100 > 90);

let isLoading = computed(() => store.state.slideInfoLoading);

let slideInfo = computed(() => store.state.slideInfo);

let slideInfoError = computed(() => {
  const { value, decimals }   = selectedTokenBottom.value
  if(basedPosition.value === 'bottom' && (slideInfo.value && slideInfo.value.reserveY < decimalToAmount(value, decimals))){
    return false
  }else{
    return true
  }
})

let bigThanReserve = computed(() => store.state.isMoreThanReserve)

let isNotExistsPair = computed(() => store.getters.isNotExistsPair || store.state.lpNotExist);

const isAuthWallet = computed(() => store.state.isAuthWallet);

const address = computed(() => store.state.address);

const openConnectModal = () => {
  store.commit(MutationType.SetConnectModal, true);
  store.commit(MutationType.ResetWalletList);
};

const showConfirmModal = (e) => {
  if (isLoading.value) return;
  store.commit(MutationType.SetShowPromtSwapModal, true);
};
const isBothSelected = computed(() => {
  return store.getters.isSelectedBothPostion;
});

const swapCurrency = async () => {
  if (isLoading.value) return;
  
  const {
    symbol: symbolTop,
    logo: logoTop,
    value: valueTop,
    address: addressTop,
    ...propsTop
  } = selectedTokenTop.value;
  const {
    symbol: symbolBot,
    logo: logoBot,
    value: valueBot,
    address: addressBot,
    ...propsBot
  } = selectedTokenBottom.value;

  store.commit(MutationType.SetSelectTokenBottom, {
    symbol: symbolTop,
    logo: logoTop,
    value: valueTop,
    address: addressTop,
    ...propsTop,
  });

  store.commit(MutationType.SetSelectTokenTop, {
    symbol: symbolBot,
    logo: logoBot,
    value: valueBot,
    address: addressBot,
    ...propsBot,
  });

  store.commit(
    MutationType.SetBasedPosition,
    basedPosition.value === "top" ? "bottom" : "top"
  );

  store.commit(MutationType.ResetInputStatus);

  if (!isBothSelected.value) return;

  if (basedPosition.value === "top" && !selectedTokenTop.value.value) return;

  if (basedPosition.value === "bottom" && !selectedTokenBottom.value.value)
    return;

  if (basedPosition.value === "top" || basedPosition.value === "bottom") {
    // await nextTick()
    store.dispatch(ActionTypes.loopGetPrice, { type: "swapCurrency", callback: getPrice });
  }
};
const getPrice = (params)=>{
  store.dispatch(ActionTypes.GetAnotherSwapPosition, params);
}

onBeforeUnmount(() => {
  store.commit(MutationType.SetBasedPosition, null);
  store.commit(MutationType.ResetInputOpacity, null);
  store.commit(MutationType.ResetInputStatus, null);
});
</script>

<style lang="scss">
.swap-title-container {
  height: 32px;
}

.swap {
  position: relative;
  max-width: 512px;
  box-sizing: border-box;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  box-shadow: rgb(0 0 0 / 1%) 0 0 1px, rgb(0 0 0 / 4%) 0 4px 8px,
    rgb(0 0 0 / 4%) 0 16px 24px, rgb(0 0 0 / 1%) 0 24px 32px;
  border-radius: 24px;
  margin-top: 1rem;
  .fix-wrapper {
    margin-top: 0 !important;
  }
  &__currency {
    &.row {
      position: relative;
      padding: 15px;
      row-gap: 8px;
      display: grid;
      grid-auto-rows: auto;
    }

    &__switch {
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
}
</style>
