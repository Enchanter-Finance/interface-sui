<template>
  <div :class="['wrapper', 'theme--light']">
    <vue-header></vue-header>
    <router-view />
    <vue-footer></vue-footer>

    <!-- wallet and select token -->
    <vue-modal-connect-wallet :show="isConnectModalOpen" />
    <vue-modal-account-info :show="isAccountModalOpen" />
    <vue-swap-modal-select-token v-if="isSwapSelectTokenModalOpen" :show="isSwapSelectTokenModalOpen" />
    <vue-lp-modal-select-token v-if="isLpSelectTokenModalOpen" :show="isLpSelectTokenModalOpen" />

    <!-- swap_modal -->
    <vue-prompt-confirm-swap
      :show="isShowPromptSwapModal"
      @confirmSwap="handleExchange"
    />
    <vue-transaction-confirmation-modal :show="isShowExchangeConfirmModal" />
    <vue-swap-result-modal :show="isShowSwapResult" />
    <vue-transaction-pop-up v-if="isShowTransactionPopUp" />
    <token-confirm-modal
      :show="isShowTokenConfirmModal.visible"
      :token="isShowTokenConfirmModal.token"
    />

    <!-- lp_modal -->
    <lp-prompt-confirm-add
      :show="isShowPromptAddModal"
      @confirmSwap="handleSupply"
    />
    <lp-transaction-confirmation-modal :show="isShowAddConfirmModal" />
    <lp-swap-result-modal :show="isAddLpResult" />
    <lp-transaction-pop-up v-if="isAddTransactionPopUp" />

    <!-- remove_modal -->
    <remove-prompt-confirm-remove
      :show="isShowPromptRemoveModal"
      @confirmSwap="handleRemove"
    />
    <remove-transaction-confirmation-modal :show="isShowRemoveConfirmModal" />
    <remove-remove-result-modal :show="isRemoveLpResult" />
    <remove-transaction-pop-up v-if="isRemoveTransactionPopUp" />

    <Transition name="fade">
      <Toast v-if="showToast" :showText="showToast" />
    </Transition>
  </div>
</template>

<script>
import EnchanterWallet from "@/utils/wallet.js";
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ActionTypes } from "@/store/actions";
import { MutationType } from "@/store/mutations";
import VueHeader from "@/components/navigation/VueHeader/VueHeader.vue";
import VueFooter from "@/components/navigation/VueFooter/VueFooter.vue";
import VueModalConnectWallet from "@/components/modal/global/VueModalConnectWallet.vue";
import VueModalAccountInfo from "@/components/modal/global/VueModalAccountInfo.vue";
import VueSwapModalSelectToken from "@/components/modal/swap/VueSwapModalSelectToken.vue";
import VueLpModalSelectToken from "@/components/modal/addLp/LpModalSelectToken.vue";

// swap modal
import VueTransactionConfirmationModal from "@/components/modal/swap/VueTransactionConfirmationModal.vue";
import VuePromptConfirmSwap from "@/components/modal/swap/VuePromptConfirmSwap.vue";
import VueSwapResultModal from "@/components/modal/swap/VueSwapResultModal.vue";
import VueTransactionPopUp from "@/components/modal/swap/VueTransactionPopUp.vue";
import TokenConfirmModal from "@/components/modal/swap/TokenConfirmModal.vue";

// add lp modal
import LpPromptConfirmAdd from "@/components/modal/addLp/AddPromptConfirm.vue";
import lpTransactionConfirmationModal from "@/components/modal/addLp/AddTransactionConfirmationModal.vue";
import LpSwapResultModal from "@/components/modal/addLp/AddResultModal.vue";
import LpTransactionPopUp from "@/components/modal/addLp/AddTransactionPopUp.vue";

import RemovePromptConfirmRemove from "@/components/modal/removeLp/RemovePromptConfirmRemove.vue";
import RemoveTransactionConfirmationModal from "@/components/modal/removeLp/TransactionConfirmationModal.vue";
import RemoveRemoveResultModal from "@/components/modal/removeLp/RemoveRemoveResultModal.vue";
import RemoveTransactionPopUp from "@/components/modal/removeLp/RemoveTransactionConfirmationModal.vue";

import Toast from "@/components/common/Toast.vue";

export default {
  components: {
    VueSwapModalSelectToken,
    VueLpModalSelectToken,
    VueModalConnectWallet,
    VueHeader,
    VueFooter,
    VueModalAccountInfo,
    VueTransactionConfirmationModal,
    VuePromptConfirmSwap,
    VueSwapResultModal,
    VueTransactionPopUp,
    TokenConfirmModal,
    LpPromptConfirmAdd,
    lpTransactionConfirmationModal,
    LpSwapResultModal,
    LpTransactionPopUp,
    RemovePromptConfirmRemove,
    RemoveTransactionConfirmationModal,
    RemoveRemoveResultModal,
    RemoveTransactionPopUp,
    Toast,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isConnectModalOpen = computed(() => store.state.isConnectModalOpen);
    const isAccountModalOpen = computed(() => store.state.isAccountModalOpen);
    const isSwapSelectTokenModalOpen = computed(
      () => store.state.isSwapSelectTokenModalOpen.visible
    );
    const isLpSelectTokenModalOpen = computed(
      () => store.state.isLpSelectTokenModalOpen.visible
    );

    // swap modal
    const isShowExchangeConfirmModal = computed(
      () => store.state.isShowExchangeConfirmModal
    );
    const isShowPromptSwapModal = computed(
      () => store.state.isShowPromptSwapModal
    );
    const isShowSwapResult = computed(() => store.state.isShowSwapResult);
    const isShowTransactionPopUp = computed(
      () => store.state.isShowTransactionPopUp
    );

    const isShowTokenConfirmModal = computed(
      () => store.state.isShowTokenConfirmModal
    );

    // add lp modal
    const isShowAddConfirmModal = computed(
      () => store.state.isShowAddConfirmModal
    );
    const isShowPromptAddModal = computed(
      () => store.state.isShowPromptAddModal
    );
    const isAddLpResult = computed(() => store.state.isAddLpResult);
    const isAddTransactionPopUp = computed(
      () => store.state.isAddTransactionPopUp
    );

    // remove lp modal
    const isShowPromptRemoveModal = computed(
      () => store.state.isShowPromptRemoveModal
    );
    const isShowRemoveConfirmModal = computed(
      () => store.state.isShowRemoveConfirmModal
    );
    const isRemoveLpResult = computed(() => store.state.isRemoveLpResult);
    const isRemoveTransactionPopUp = computed(
      () => store.state.isRemoveTransactionPopUp
    );

    const showToast = computed(() => store.state.showToast);

    const handleExchange = async (e) => {
      store.dispatch(ActionTypes.StartSwap);
    };

    const handleSupply = async (e) => {
      store.dispatch(ActionTypes.AddLp,{
        callback: toPool,
      });
    };
    const toPool = () => {
      router.push({ path: "/pool" });
    };
    const handleRemove = async (e) => {
      store.dispatch(ActionTypes.RemoveLiduidity, {
        callback: toPool,
      });
    };

    store.dispatch(ActionTypes.GetTokenItems);

    onMounted(async () => {
      const walletInstance = new EnchanterWallet();
      const response = await walletInstance.initLogin();
      store.commit(MutationType.SetWallet, response);
      if (store.state.isAuthWallet) {
        store.dispatch(ActionTypes.GetTokenBalance);
        store.dispatch(ActionTypes.onNetworkChange);
      }
    });

    return {
      isConnectModalOpen,
      isSwapSelectTokenModalOpen,
      isLpSelectTokenModalOpen,
      isAccountModalOpen,
      isShowExchangeConfirmModal,
      isShowPromptSwapModal,
      handleExchange,
      handleSupply,
      handleRemove,
      isShowSwapResult,
      isShowTransactionPopUp,
      isShowTokenConfirmModal,
      isShowAddConfirmModal,
      isShowPromptAddModal,
      isAddLpResult,
      isAddTransactionPopUp,
      isShowPromptRemoveModal,
      isShowRemoveConfirmModal,
      isRemoveLpResult,
      isRemoveTransactionPopUp,
      showToast,
    };
  },
};
</script>

<style lang="scss">
.theme--light {
  background-color: map-get($light, "application", "background");
  background-image: url("./assets/images/enchanter_bg.jpg");
  background-size: 100% 100%;
  background-position: center center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
