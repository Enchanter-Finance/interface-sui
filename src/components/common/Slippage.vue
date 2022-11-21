<template>
  <vue-menu :show="settingOpen" @close="close">
    <div class="menu-layout--transaction-settings">
      <div class="menu-layout__title">Transaction Settings</div>
      <span class="menu-layout__label">
        Slippage tolerance<vue-tooltip
          tip="Your transaction will revert if the price changes unfavorably by more than this percentage."
          direction="bottom-right"
          ><span class="vue-tooltip__inner vue-tooltip__inner--shift--left"
            >?</span
          ></vue-tooltip
        >
      </span>
      <div class="slippage-tolerance">
        <vue-button
          @click="handleAutoClick"
          class="button--setting"
          :class="{ active: isAutoActive }"
          >Auto</vue-button
        >
        <div
          class="slippage-tolerance__input__container"
          :class="{
            input_error: notifyType === 'error',
            input_warning: notifyType === 'warning',
            hoverName: !isAutoActive,
          }"
        >
          <div class="slippage-tolerance__input__wrapper">
            <svg
              v-if="notifyType === 'warning'"
              class="warning-svg"
              width="22"
              height="19"
              viewBox="0 0 22 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.3166 2.62415C10.1036 1.39735 11.8964 1.39735 12.6834 2.62415L18.1175 11.0951C18.9714 12.4262 18.0156 14.175 16.4341 14.175H5.56589C3.98442 14.175 3.02858 12.4262 3.88249 11.0951L9.3166 2.62415Z"
                fill="#FFA869"
              />
              <path
                d="M11 9V6"
                stroke="white"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11 12V11.5"
                stroke="white"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              @input="handleSlippageInput"
              @blur="handleBlur"
              placeholder="0.5"
              type="text"
              :value="slippageNum"
              class="slippage-tolerance__input"
              @keypress="onlyForCurrency"
            />
            %
          </div>
        </div>
      </div>
      <span
        v-if="showNotify"
        class="notify-msg"
        :class="{ isError: notifyType === 'error' }"
        >{{ notifyMsg }}</span
      >
    </div>
  </vue-menu>
</template>

<script setup>
import VueMenu from "@/components/layout/VueMenu/VueMenu.vue";
import VueTooltip from "@/components/tooltip/VueTooltip.vue";
import VueToggle from "@/components/input/VueToggle.vue";
import VueButton from "@/components/button/VueButton.vue";
import { useStore } from "vuex";
import { ref, computed, onBeforeUnmount } from "vue";
import { MutationType } from "@/store/mutations";
import { localStorage } from "@/utils/localStorage";
const store = useStore();

defineProps({
  settingOpen: Boolean,
});

const emit = defineEmits(["closeSet"]);
const close = () => {
  emit("closeSet");
};

const showNotify = ref(false);
const notifyType = ref("");
const notifyMsg = ref("");

const SlippageTolerance = computed(() => store.state.slipage);

const isAutoActive = ref(false);

const slippageNum = ref(SlippageTolerance.value);

const handleAutoClick = () => {
  slippageNum.value = "0.5";
  store.commit(MutationType.SetSlippage, "0.5");
  localStorage.set("defaultSlippage", "0.5");
  isAutoActive.value = true;
  notifyMsg.value = "";
  notifyType.value = "normal";
  showNotify.value = false;
};

const initialStatus = (val) => {
  val = +val;
  if (val > 50) {
    notifyMsg.value = "Enter a valid slippage percentage";
    isAutoActive.value = false;
    notifyType.value = "error";
    showNotify.value = true;
  } else if (val <= 50 && val > 1) {
    isAutoActive.value = false;
    showNotify.value = true;
    notifyType.value = "warning";
    notifyMsg.value = "Your transaction may be frontrun";
  } else if (val > 0 && val < 0.1) {
    isAutoActive.value = false;
    showNotify.value = true;
    notifyType.value = "warning";
    notifyMsg.value = "Your transaction may fail";
  } else {
    showNotify.value = false;
    isAutoActive.value = false;
    notifyType.value = "normal";
    notifyMsg.value = "";
    if (val == "0.5") {
      showNotify.value = false;
      isAutoActive.value = true;
      notifyType.value = "";
      notifyMsg.value = "";
      localStorage.set("defaultSlippage", 0.5);
    }
  }
};

initialStatus(slippageNum.value);

const handleSlippageInput = (e) => {
  const val = e.target.value;
  slippageNum.value = val;
  if (val > 50) {
    notifyMsg.value = "Enter a valid slippage percentage";
    isAutoActive.value = false;
    notifyType.value = "error";
    showNotify.value = true;
    localStorage.set("defaultSlippage", val);
  } else if (val <= 50 && val > 1) {
    isAutoActive.value = false;
    showNotify.value = true;
    notifyType.value = "warning";
    notifyMsg.value = "Your transaction may be frontrun";
    localStorage.set("defaultSlippage", val);
  } else if (val > 0 && val < 0.1) {
    isAutoActive.value = false;
    showNotify.value = true;
    notifyType.value = "warning";
    notifyMsg.value = "Your transaction may fail";
    localStorage.set("defaultSlippage", val);
  } else {
    showNotify.value = false;
    isAutoActive.value = false;
    notifyType.value = "normal";
    notifyMsg.value = "";
    localStorage.set("defaultSlippage", val);
    if (val == "0.5") {
      showNotify.value = false;
      isAutoActive.value = true;
      notifyType.value = "";
      notifyMsg.value = "";
      localStorage.set("defaultSlippage", 0.5);
    }
  }
};

const isTrueNumber = (num) => {
  if (/^\d+(\.\d+)?$/.test(num)) {
    return num;
  } else {
    return false;
  }
};

const handleBlur = (e) => {
  const val = e.target.value;
  if (val > 50 || !val) {
    handleAutoClick();
  } else {
    slippageNum.value =
      (isTrueNumber(val) && val > 0 && isTrueNumber(val)) || "0.5";
    store.commit(
      MutationType.SetSlippage,
      isTrueNumber(slippageNum.value) || "0.5"
    );
  }
};
onBeforeUnmount(() => {
  store.commit(
    MutationType.SetSlippage,
    isTrueNumber(slippageNum.value) || "0.5"
  );
});
const onlyForCurrency = ($event) => {
  let keyCode = $event.keyCode ? $event.keyCode : $event.which;
  // only allow number and one dot
  if (
    (keyCode < 48 || keyCode > 57) &&
    (keyCode !== 46 || slippageNum.value.indexOf(".") != -1)
  ) {
    // 46 is dot
    $event.preventDefault();
  }
  // 0.
  // restrict to 2 decimal places
  // if(tokenAmount.value != null && tokenAmount.value.indexOf(".") > -1 && (tokenAmount.value.split('.')[1].length > 1)){
  //   $event.preventDefault();
  // }
};
</script>

<style lang="scss" scoped>
.menu-layout {
  &--transaction-settings {
    display: grid;
    grid-auto-rows: auto;
    row-gap: 12px;
    padding: 18px;
  }
  &__title {
    color: rgba(255, 255, 255, 0.5);
  }
  &__label {
  }
}

.slippage-tolerance {
  width: 100%;
  display: flex;
  padding: 0;
  -webkit-box-align: center;
  align-items: center;
  justify-content: space-between;

  &__input__container {
    width: auto;
    height: 2rem;
    position: relative;
    padding: 12px 16px;
    flex: 1 1 0;
    color: rgb(255, 255, 255);
    -webkit-box-align: center;
    box-sizing: border-box;
    align-items: center;
    border-radius: 36px;
    font-size: 1rem;
    min-width: 3.5rem;
    outline: none;
    background: #4c3c70;
    border: 2px solid #584a6f;
    display: flex;
    &:hover {
      border: 2px solid #8b54ff;
    }
    &.input_warning {
      border: 2px solid #ffa869;
    }
    &.input_error {
      border: 2px solid rgb(255, 67, 67);
    }
    &.hoverName {
      border: 2px solid #8b54ff;
    }
  }

  &__input__wrapper {
    justify-content: space-between;
    width: 100%;
    display: flex;
    padding: 0;
    -webkit-box-align: center;
    align-items: center;
    .warning-svg {
      position: absolute;
      left: 10px;
      top: 6px;
    }
  }

  &__input {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 2rem;
    font-size: 16px;
    outline: none;
    color: rgb(255, 255, 255);
    text-align: right;
    background: #4c3c70;

    &::placeholder {
      -webkit-text-security: none;
      color: rgb(117, 117, 117);
      direction: inherit !important;
      pointer-events: none !important;
      text-orientation: inherit !important;
      writing-mode: inherit !important;
    }
  }

  .button--setting {
    align-items: center;
    width: auto;
    height: 2rem;
    border-radius: 36px;
    font-size: 1rem;
    min-width: 3.5rem;
    border: 2px solid #71608b;
    outline: none;
    background: #4c3c70;
    padding: 1px 6px;
    margin-right: 8px;
    color: #fff;
    &:hover {
      border: 2px solid #8b54ff;
    }
    &.active {
      background-color: #8b54ff;
      border: 2px solid #8b54ff;
    }
  }
}

.notify-msg {
  font-size: 14px;
  line-height: 1;
  padding-top: 7px;
  font-weight: 400;
  color: rgb(243, 132, 30);
  &.isError {
    color: red;
  }
}
</style>
