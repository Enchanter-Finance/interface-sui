<template>
  <div class="currency-panel">
    <div class="currency-panel__currency">
      <input
        class="currency-panel__input"
        :class="{ isOpacity: isOpacity }"
        inputmode="decimal"
        autocomplete="off"
        autocorrect="off"
        type="text"
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder="0.0"
        minlength="1"
        maxlength="79"
        spellcheck="false"
        @input="handleInput"
        @keypress="onlyForCurrency"
        :value="tokenAmount"
      />
      <vue-currency-select
        :is-selected="isSelected"
        :token="token"
        @click="openSelectToken"
      ></vue-currency-select>
    </div>
    <div class="currency-panel__info">
      <div v-if="isSelected" class="currency-panel__info__container">
        <div class="currency-panel__info__value">
          <template v-if="false"> ~$ <span> </span></template>
          <span v-else> &nbsp; </span>
        </div>
        <div
          v-if="showBalance"
          class="currency-panel__info__balance"
          @click="selectMax"
        >
          <span class="balance-text"
            >Balance: {{ formatDecimalsNum(token.balance) || 0 }}
          </span>
          <div v-if="showMaxBtn" class="button-mini">MAX</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import VueCurrencySelect from "@/components/common/VueCurrencySelect.vue";
import { useStore } from "vuex";
import { MutationType } from "@/store/mutations";
import { ActionTypes } from "@/store/actions";
import { debounce, toFixed, formatDecimalsNum, decimalToAmount, amountToDecimal } from "@/utils/index";
import { SUI_ADDRESS } from '@/libs/enchanter_sui.ts'
export default {
  name: "VueCurrencyPanel",
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
    token: {
      type: Object,
      default: {},
    },
    position: {
      type: String,
    },
  },
  components: { VueCurrencySelect },
  setup(props, { emit }) {
    const store = useStore();

    let selectedTokenTop = computed(() => store.state.selectedTokenTop);
    let selectedTokenBottom = computed(() => store.state.selectedTokenBottom);
    let slideInfoLoading = computed(() => store.state.slideInfoLoading);

    const isAuthWallet = computed(() => store.state.isAuthWallet);

    let tokenAmount = computed(() =>props.position === "top" ? selectedTokenTop.value.value : selectedTokenBottom.value.value );

    let basedPosition = computed(() => store.state.basedPosition);

    const approxPrice = computed(() => {
      // return new Intl.NumberFormat().format(selectedTokenAccount.value?.price * tokenAmount.value)
    });
    const isBothSelected = computed(() => store.getters.isSelectedBothPostion)

    const isbalanceLoad = computed(() => store.state.balanceLoaded)

    const showBalance = computed(() => isbalanceLoad.value && isAuthWallet.value && !!props.token.symbol)

    const showMaxBtn = computed(() => props.position === 'top' && !slideInfoLoading.value && props.token.balance > props.token.value)
    
    let isOpacity = computed(()=> props.position === 'top' ? store.state.inputTopOpacity : store.state.inputBottomOpacity)
    
    let isNotExistsPair = computed(() => store.getters.isNotExistsPair)
    
    const getAnotherPositionValue = async (num)=>{
      store.dispatch(ActionTypes.loopGetPrice, { type: "inputField", callback: getPrice });
    };

    const debounceMethod = debounce((num) => {
      getAnotherPositionValue(num);
    }, 600);

    const getFomatNumber = (numStr) => {
      return numStr;
    };
    const handleInput = (e) => {
      const num = getFomatNumber(e.target.value);
  
      if (isNotExistsPair.value) return;
      commonSet(num);
    };
    const commonSet = (inputValue) => {
      const noopVal = "";
      store.commit(MutationType[props.position === "top" ? "SetSelectTokenTopValue" : "SetSelectTokenBottomValue"], inputValue);

      if (!isBothSelected.value) {
        store.commit(MutationType[props.position === "top" ? "SetSelectTokenBottomValue" : "SetSelectTokenTopValue"], noopVal);
      }

      store.commit(MutationType.SetBasedPosition, props.position);

      if (+inputValue === 0) {
        store.commit(MutationType.ResetInputStatus);
        store.commit(MutationType.SetBasedPosition, null);
        return setAnotherPositionAmount(noopVal);
      }
      if (!isBothSelected.value)
        return store.commit(MutationType.ResetInputStatus);

      debounceMethod(inputValue);
    };

    const setAnotherPositionAmount = (val) => {
      store.commit(MutationType[props.position === "top" ? "SetSelectTokenBottomValue" : "SetSelectTokenTopValue"], val);
    };

    const openSelectToken = () => {
      store.commit(MutationType.SetSwapSelectTokenModal, {
        visible: true,
        position: props.position,
      });
    };

    const getPrice = (params)=>{    
      store.dispatch(ActionTypes.GetAnotherSwapPosition, params);
    }

    const selectMax = () => {
      const { balance, decimals } = props.token
      if (props.position === "bottom" || +props.token.balance <= 0) return;
      store.commit(MutationType.SetBasedPosition, "top");
      
      let fixedBalance = 0
      if (props.token.address === SUI_ADDRESS) {
        let isRtSix = decimalToAmount(balance, decimals) > 122000
        if (isRtSix) {
          fixedBalance = amountToDecimal(decimalToAmount(balance, decimals) - 122000 , decimals)
        } else {
          fixedBalance = +props.token.balance;
        }
      } else {
        fixedBalance = +props.token.balance;
      }
      store.commit(MutationType.SetSelectTokenTopValue, toFixed(fixedBalance));

      if (!isBothSelected.value) return;      
      store.dispatch(ActionTypes.loopGetPrice, { type: "selectToken", callback: getPrice });
    };

    const onlyForCurrency = ($event) => {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;
      // only allow number and one dot
      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || tokenAmount.value.indexOf(".") != -1)
      ) {
        // 46 is dot
        $event.preventDefault();
      }
      // restrict to 2 decimal places
      // if(tokenAmount.value != null && tokenAmount.value.indexOf(".") > -1 && (tokenAmount.value.split('.')[1].length > 1)){
      //   $event.preventDefault();
      // }
    };

    return {
      tokenAmount,
      openSelectToken,
      isAuthWallet,
      handleInput,
      isOpacity,
      selectMax,
      showBalance,
      showMaxBtn,
      onlyForCurrency,
      formatDecimalsNum,
    };
  },
};
</script>

<style lang="scss">
.currency-panel {
  width: 100%;
  border-radius: 12px;
  background: rgba(227, 197, 245, 0.1);
  box-sizing: border-box;
  height: auto;

  .button-mini {
    background-color: rgba(139, 84, 255, 0.3);
    user-select: none;
    color: #8b54ff;
    padding: 4px 6px;
    border-radius: 12px;
    margin-left: 2px;
    font-size: 11px;
    &:hover {
      color: #7040d8;
    }
  }
  &__currency {
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 1rem 0.2rem 0.75rem 1rem;
  }

  &__input {
    filter: none;
    opacity: 1;
    transition: opacity 0.2s ease-in-out 0s;
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
    &.isOpacity {
      filter: grayscale(1);
      opacity: 0.4;
    }
  }

  &__info {
    justify-content: flex-end;
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    color: rgb(255, 255, 255);
    font-size: 0.75rem;
    line-height: 1rem;
    padding: 0 1rem 0.8rem;

    &__container {
      width: 100%;
      display: flex;
      padding: 0;
      -moz-box-align: center;
      align-items: center;
      justify-content: space-between;
      color: rgb(195, 197, 203);
    }

    &__balance {
      height: 17px;
      display: flex;
      padding: 0;
      -moz-box-align: center;
      align-items: center;
      -moz-box-pack: start;
      justify-content: flex-start;
      color: rgb(195, 197, 203);
      position: relative;
      cursor: pointer;
      .balance-text {
        padding-right: 3px;
        font-size: 14px;
      }
    }

    &__value {
      color: rgb(195, 197, 203);
      span {
        color: #fff;
      }
    }
  }
}
</style>
