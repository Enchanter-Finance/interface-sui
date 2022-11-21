import { localStorage } from "../utils/localStorage";
export const state = {
  // account or connect modal
  isConnectModalOpen: false,
  isAccountModalOpen: false,
  clickable: false,
  balanceLoaded: false,
  // swap confirm and result modal
  isShowExchangeConfirmModal: false,
  isShowPromptSwapModal: false,
  isShowSwapResult: {
    status: null,
    visible: false,
  },
  isShowTransactionPopUp: false,

  // add confirm and result modal
  isShowAddConfirmModal: false,
  isShowPromptAddModal: false,
  isAddLpResult: {
    status: null,
    visible: false,
  },
  isAddTransactionPopUp: false,

  // remove confirm and result modal
  isShowRemoveConfirmModal: false,
  isShowPromptRemoveModal: false,
  isRemoveLpResult: {
    status: null,
    visible: false,
  },
  isRemoveTransactionPopUp: false,

  // select modal
  isSwapSelectTokenModalOpen: {
    visible: false,
    position: "top",
  },
  isShowTokenConfirmModal: {
    token: null,
    visible: false,
  },
  isLpSelectTokenModalOpen: {
    visible: false,
    position: "top",
  },
  // token top and token bottom
  selectedTokenTop: {},
  selectedTokenBottom: {},
  //
  basedPosition: null,
  slideInfo: null,
  slideInfoLoading: false,
  isMoreThanReserve: false,
  // input component to be gray
  inputTopOpacity: false,
  inputBottomOpacity: false,
  //
  tokenList: [],
  walletList: [],
  isAuthWallet: "",
  address: "",

  // LP  
  currentLpData : {
    token_in:'',
    token_out:'',
    reserveData:{}
  },  
  slipage:+localStorage.get('defaultSlippage') || '0.5',
  transaction:null,
  aptBalance:0,
  removeData:{},
  showToast:false,
  netWork:'Testnet',
  isAddOrCreateLp:'',
  liquidityFee:0.0030,
  lpNotExist:false,
}
