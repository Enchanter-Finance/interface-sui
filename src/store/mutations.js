import { getWallets } from '../utils/aptosConstants'
import { localStorage } from "../utils/localStorage";
import { APTOS_ADDRESS } from '@/libs/enchanter.ts'
export const MutationType = {  
  SetConnectModal : "SET_CONNECT_MODAL",
  SetSwapSelectTokenModal : "SET_SWAP_SELECT_TOKEN_MODAL",
  SetLpSelectTokenModal : "SET_LP_SELECT_TOKEN_MODAL",
  SetAccountModal : "SET_ACCOUNT_MODAL",
  SetSelectTokenTop : "SET_SELECT_TOKEN_TOP",
  SetSelectTokenBottom : "SET_SELECT_TOKEN_BOTTOM",
  SetSelectTokenTopValue : "SET_SELECT_TOKEN_TOP_VALUE",
  SetSelectTokenBottomValue : "SET_SELECT_TOKEN_BOTTOM_VALUE",
  SetSelectTokenTopBalance : "SET_SELECT_TOKEN_TOP_BALANCE",
  SetSelectTokenBottomBalance : "SET_SELECT_TOKEN_BOTTOM_BALANCE",
  SetTokens : "SET_TOKENS",
  SetAddress : "SET_ADDRESS",
  SetWallet : "SET_WALLET",
  ResetWalletList : "RESET_WALLET_LISTS",
  SetSlideInfo:'SET_SLIDE_INFO',
  SetSlideInfoLoading:'SET_SLIDE_INFO_LOADING',
  SetIsMoreThanReserve:'SET_IS_MORE_THAN_RESERVE',
  ResetInputStatus:'RESET_INPUT_STATUS',
  ResetSlideStatus:'RESET_SLIDE_STATUS',
  SetInputOpacity:'SET_INPUT_OPACITY',
  ResetInputOpacity:'RESET_INPUT_OPACITY',
  SetBasedPosition:'SET_BASED_POSITION',
  
  // swap modal
  SetExchangeConfirmModal: "SET_EXCHANGE_CONFIRM_MODAL",
  SetShowPromtSwapModal: "SET_SHOW_PROMT_SWAP_MODAL",
  SetShowSwapResult: "SET_SHOW_SWAP_RESULT",
  SetShowTransactionPopUp: "SET_SHOW_TRANSACTION_POP_UP",
  ResetSwapModal: "RESET_SWAP_MODAL",
  SetShowTokenConfirmModal: "SET_SHOW_TOKEN_CONFIRM_MODAL",

  // addlp modal
  SetAddConfirmModal: "SET_ADD_CONFIRM_MODAL",
  SetShowPromtAddModal: "SET_SHOW_PROMT_ADD_MODAL",
  SetShowAddResult: "SET_SHOW_ADD_RESULT",
  SetShowTransactionAddPopUp: "SET_SHOW_TRANSACTION_ADD_POP_UP",
  ResetAddModal: "RESET_ADD_MODAL",

  // removelp modal
  SetRemoveConfirmModal: "SET_REMOVE_CONFIRM_MODAL",
  SetShowPromtRemoveModal: "SET_SHOW_PROMT_REMOVE_MODAL",
  SetShowRemoveResult: "SET_SHOW_REMOVE_RESULT",
  SetShowTransactionRemovePopUp: "SET_SHOW_TRANSACTION_REMOVE_POP_UP",
  ResetRemoveModal: "RESET_REMOVE_MODAL",

  ResetSelectedToken:'RESET_SELECTED_TOKEN',
  SetCurrentLpData:'SET_CURRENT_LP_DATA',
  SetSlippage:'SET_SLIPPAGE',
  SetTransaction:'SET_TRANSACTION',
  SetClickAble:'SET_CLICK_ABLE',
  SetBalanceLoaded:'SET_BALANCE_LOADED',
  SetAptBalance:'SET_APT_BALANCE',
  SetRemoveData:'SET_REMOVE_DATA',  
  SetshowToast:'SETSHOW_TOAST',  
  SetNetWork:'SET_NET_WORK',
  setIsAddOrCreate:'SET_IS_ADD_OR_CREATE',
  setLpNotExist:'SET_LP_NOT_EXIST'
}

export const mutations = {
  [MutationType.SetConnectModal](state, value) {
    state.isConnectModalOpen = value;
  },
  [MutationType.SetAccountModal](state, value) {
    state.isAccountModalOpen = value;
  },
  [MutationType.SetClickAble](state, value) {
    state.clickable = value;
  },
  [MutationType.SetBalanceLoaded](state, value) {
    state.balanceLoaded = value;
  },
  // swap modal
  [MutationType.SetExchangeConfirmModal](state, value) {
    state.isShowExchangeConfirmModal = value;
  },
  [MutationType.SetShowPromtSwapModal](state, value) {
    state.isShowPromptSwapModal = value;
  },
  [MutationType.SetShowSwapResult](state, value) {
    state.isShowSwapResult = value;
  },
  [MutationType.SetShowTransactionPopUp](state, value) {
    state.isShowTransactionPopUp = value;
  },
  [MutationType.ResetSwapModal](state, value) {
    state.isShowExchangeConfirmModal = false;
    state.isShowPromptSwapModal = false;
    state.isShowSwapResult = { status: null, visible: false };
    state.isShowTransactionPopUp = false;
  },

  [MutationType.SetShowTokenConfirmModal](state, value) {
    state.isShowTokenConfirmModal = value;
  },

  // add lp modal
  [MutationType.SetAddConfirmModal](state, value) {
    state.isShowAddConfirmModal = value;
  },
  [MutationType.SetShowPromtAddModal](state, value) {
    state.isShowPromptAddModal = value;
  },
  [MutationType.SetShowAddResult](state, value) {
    state.isAddLpResult = value;
  },
  [MutationType.SetShowTransactionAddPopUp](state, value) {
    state.isAddTransactionPopUp = value;
  },
  [MutationType.ResetAddModal](state, value) {
    state.isShowAddConfirmModal = false;
    state.isShowPromptAddModal = false;
    state.isAddLpResult = { status: null, visible: false };
    state.isAddTransactionPopUp = false;
  },

  // remove lp modal
  [MutationType.SetRemoveConfirmModal](state, value) {
    state.isShowRemoveConfirmModal = value;
  },
  [MutationType.SetShowPromtRemoveModal](state, value) {
    state.isShowPromptRemoveModal = value;
  },
  [MutationType.SetShowRemoveResult](state, value) {
    state.isRemoveLpResult = value;
  },
  [MutationType.SetShowTransactionRemovePopUp](state, value) {
    state.isRemoveTransactionPopUp = value;
  },
  [MutationType.ResetRemoveModal](state, value) {
    state.isShowRemoveConfirmModal = false;
    state.isShowPromptRemoveModal = false;
    state.isRemoveLpResult = { status: null, visible: false };
    state.isRemoveTransactionPopUp = false;
  },

  [MutationType.SetSwapSelectTokenModal](state, value) {
    state.isSwapSelectTokenModalOpen = value;
  },
  [MutationType.SetLpSelectTokenModal](state, value) {
    state.isLpSelectTokenModalOpen = value;
  },
  [MutationType.SetSelectTokenTop](state, token) {
    state.selectedTokenTop = token;
  },
  [MutationType.SetSelectTokenBottom](state, token) {
    state.selectedTokenBottom = token;
  },
  [MutationType.SetSelectTokenTopValue](state, value) {
    state.selectedTokenTop["value"] = value;
  },
  [MutationType.SetSelectTokenBottomValue](state, value) {
    state.selectedTokenBottom["value"] = value;
  },
  [MutationType.SetSelectTokenTopBalance](state, value) {
    state.selectedTokenTop["balance"] = value;
  },
  [MutationType.SetSelectTokenBottomBalance](state, value) {
    state.selectedTokenBottom["balance"] = value;
  },
  [MutationType.SetTokens](state, coins) {
    state.tokenList = coins;
    const apt = coins.find((_) => _.address === APTOS_ADDRESS) || {};
    state.aptBalance = apt.balance;
  },
  [MutationType.SetAddress](state, value) {
    state.address = value;
  },
  [MutationType.SetSlideInfo](state, value) {
    state.slideInfo = value;
  },
  [MutationType.SetSlideInfoLoading](state, value) {
    state.slideInfoLoading = value;
  },
  [MutationType.SetIsMoreThanReserve](state, value) {
    state.isMoreThanReserve = value;
  },
  [MutationType.ResetInputStatus](state, value) {
    state.slideInfo = null;
    state.slideInfoLoading = false;
    state.isMoreThanReserve = false;
  },
  [MutationType.ResetSlideStatus](state, value) {    
      state.inputTopOpacity = false
      state.inputBottomOpacity = false
      state.slideInfoLoading = false      
      state.selectedTokenTop["value"] = ''      
      state.selectedTokenBottom["value"] = ''
  },
  [MutationType.SetWallet](state, value) {
    const initialWallets = getWallets();
    const idx = initialWallets.findIndex((item) => item.name === value.wallet);
    if (idx !== -1) {
      initialWallets[idx].isConnected = true;
      state.address = value.address;
    }
    state.isAuthWallet = value.wallet;
    localStorage.set("localWallet", state.isAuthWallet);
    state.walletList = initialWallets;
  },
  [MutationType.ResetWalletList](state) {
    const initialWallets = getWallets();
    state.walletList = initialWallets;
  },
  [MutationType.SetInputOpacity](state, value) {
    value.dir === "top"
      ? (state.inputTopOpacity = true)
      : (state.inputBottomOpacity = true);
  },
  [MutationType.ResetInputOpacity](state) {
    state.inputTopOpacity = false;
    state.inputBottomOpacity = false;
  },
  [MutationType.SetBasedPosition](state, value) {
    state.basedPosition = value;
  },
  [MutationType.ResetSelectedToken](state) {
    const top = state.tokenList.find((_) => _.address === APTOS_ADDRESS) || {};
    top.value = '';
    const bot = state.tokenList.find((_) => _.address === "") || {};
    state.selectedTokenTop = top;
    state.selectedTokenBottom = bot;
  },
  [MutationType.SetCurrentLpData](state, value) {
    state.currentLpData = value;
  },
  [MutationType.SetSlippage](state, value) {
    state.slipage = value;
  },
  [MutationType.SetTransaction](state, value) {
    state.transaction = value;
  },
  [MutationType.SetAptBalance](state, value) {
    state.aptBalance = value;
  },
  [MutationType.SetRemoveData](state, value) {
    state.removeData = value;
  },  
  [MutationType.SetshowToast](state, value) {
    state.showToast = value;
  },
  [MutationType.SetNetWork](state, value) {
    state.netWork = value;
  },
  [MutationType.setIsAddOrCreate](state, value) {
    state.isAddOrCreateLp = value
  },
  [MutationType.setLpNotExist](state, value) {
    state.lpNotExist = value
  },
}
