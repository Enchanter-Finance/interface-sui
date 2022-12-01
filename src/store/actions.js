
import { MutationType } from "./mutations"
import { toFixed, formatDecimalsNum, decimalToAmount } from '@/utils/index'
import { SUI_ADDRESS } from '@/libs/enchanter_sui.ts'
import { localStorage } from "@/utils/localStorage";
var timer;
export const ActionTypes = {
  GetTokenItems: "GET_TOKEN_ITEMS",
  GetTokenBalance: "GET_TOKEN_BALANCE",
  GetAnotherSwapPosition: "GET_ANOTHER_SWAP_POSITION",
  GetAnotherLpPosition: "GET_ANOTHER_LP_POSITION",
  StartSwap: "START_SWAP",
  AddLp: "ADD_LP",
  LoopGetApt: "LOOP_GET_APT",
  GetLpReserveData: "GET_LP_RESERVE_DATA",

  RemoveLiduidity: "REMOVE_LIDUIDITY",
  onNetworkChange: "ON_NETWORK_CHANGE",
  AddTokenItem: "ADD_TOKEN_ITEM",
  loopGetPrice: "LOOP_GET_PRICE",
};

export const actions = {
  async [ActionTypes.AddTokenItem]({ commit, state }, payload) {
    let list = state.tokenList;
    list.unshift(payload);
    commit(MutationType.SetTokens, list);
  },

  async [ActionTypes.GetTokenItems]({ commit }) {
    const list = await window.suiSDK.getTokenList();
    commit(MutationType.SetTokens, list);
    commit(MutationType.ResetSelectedToken);
  },

  async [ActionTypes.GetTokenBalance]({ commit, state, dispatch }, payload) {
    const list = await window.suiSDK.getTokenList(state.address);
    dispatch(ActionTypes.LoopGetApt);
    commit(MutationType.SetBalanceLoaded, true);
    commit(MutationType.SetTokens, list);
    if (payload === "notResetSelectToken") {
      commit(MutationType.SetSelectTokenTopValue, "");
      commit(MutationType.SetSelectTokenBottomValue, "");
      const topAddress = state.selectedTokenTop.address;
      const botAddress = state.selectedTokenBottom.address;
      const topToken = list.find((_) => _.address === topAddress) || {};
      const botToken = list.find((_) => _.address === botAddress) || {};
      commit(MutationType.SetSelectTokenTopBalance, topToken.balance);
      commit(MutationType.SetSelectTokenBottomBalance, botToken.balance);
    } else {
      commit(MutationType.ResetSelectedToken);
    }
  },

  async [ActionTypes.LoopGetApt]({ commit, state, dispatch }) {
    if (timer) clearTimeout(timer);
    timer = null;    
    timer = setTimeout(async () => {
      const aptBalance = await window.suiSDK.getBalanceOfSui(state.address);
      commit(MutationType.SetAptBalance, aptBalance);      
      const arr = [...state.tokenList];
      const idx = arr.findIndex((_) => _.address === SUI_ADDRESS);

      if (idx !== -1) {
        const item = arr.find((_) => _.address === SUI_ADDRESS);
        arr[idx] = { ...item, balance: aptBalance };
      }

      commit(MutationType.SetTokens, arr);
      const topAddress = state.selectedTokenTop.address;
      const botAddress = state.selectedTokenBottom.address;

      if (topAddress === SUI_ADDRESS) {
        commit(MutationType.SetSelectTokenTopBalance, aptBalance);
      } else if (botAddress === SUI_ADDRESS) {
        commit(MutationType.SetSelectTokenBottomBalance, aptBalance);
      }
      dispatch(ActionTypes.LoopGetApt);
    }, 4000);
  },


  // todo list
  async [ActionTypes.GetAnotherSwapPosition]({ commit, state, getters }, payload) {
    commit(MutationType.setLpNotExist, false)
    if(getters.isNotExistsPair){
      return commit(MutationType.ResetSlideStatus)      
    } 

    const type = state.basedPosition === 'top' ? 'SetSelectTokenBottomValue' : 'SetSelectTokenTopValue'
    const dir = state.basedPosition === 'top' ? 'bottom' : 'top'
    const exactDir = state.basedPosition === 'top' ? 'exactIn' : 'exactOut'
    const inToken = state.basedPosition === 'top' ? state.selectedTokenTop : state.selectedTokenBottom

    if(payload.type === 'swapCurrency' && !payload.isRefresh){
      commit(MutationType[type], '')
    }
    
    if(!payload.isRefresh){
      commit(MutationType.ResetInputStatus)
      commit(MutationType.SetSlideInfoLoading, true)
      commit(MutationType.SetInputOpacity, { dir })
    }

    const { address:topAddress, decimals:topDecimals } = state.selectedTokenTop
    const { address:botAddress, decimals:botDecimals } = state.selectedTokenBottom
    const { decimals, value } = inToken
    const inAmount = decimalToAmount(value, decimals)

    let quote = await window.suiSDK.quote(exactDir, topAddress, botAddress, inAmount, [topDecimals, botDecimals])
    if(!quote){
      commit(MutationType.setLpNotExist, true)
      commit(MutationType.ResetSlideStatus);
      return 
    } 

    if(state.basedPosition === "bottom" && (+quote.reserveY < (+inAmount))){
      commit(MutationType.SetIsMoreThanReserve, true)
    }else{
      commit(MutationType.SetIsMoreThanReserve, false)
    }

    commit(MutationType.ResetInputOpacity);
    commit(MutationType.SetSlideInfoLoading, false);
    
    let { quoteDecimals: out_amount, rate, lp, reserveX, reserveY } = quote;
    if (out_amount < 0) out_amount = 0;
    commit(MutationType[type], toFixed(out_amount));
    commit(MutationType.SetSlideInfo, {
      rate: 1 / rate,
      amountTop: state.selectedTokenTop.value,
      amountBot: state.selectedTokenBottom.value,
      x: state.selectedTokenTop.symbol,
      y: state.selectedTokenBottom.symbol,
      lp,
      reserveX,
      reserveY,
    });
  },

  async [ActionTypes.StartSwap]({ commit, state, dispatch }) {
    const errorCb = () => {
      commit(MutationType.SetShowPromtSwapModal, false);
      commit(MutationType.SetShowSwapResult, {
        status: false,
        visible: true,
      });
    };
    let trn;
    commit(MutationType.SetExchangeConfirmModal, true)
    commit(MutationType.SetShowPromtSwapModal, false)    
     try {
      const{ address:topAddress, value:topValue, decimals:topDecimals } = state.selectedTokenTop
      const{ address:botAddress, value:botValue, decimals:botDecimals } = state.selectedTokenBottom
      const exactDir = state.basedPosition === 'top' ? 'exactIn' : 'exactOut'
      trn = await window.SDK.exchange(
        topAddress, 
        botAddress,         
        decimalToAmount(topValue, topDecimals),
        decimalToAmount(botValue, botDecimals),
        state.slipage * 1000 || 1000, state.address, 
        exactDir
      )
      if(!trn.hash) return errorCb()
      commit(MutationType.SetExchangeConfirmModal, false)
      commit(MutationType.SetShowSwapResult, {
        status: true,
        visible: true,
      });
      commit(MutationType.SetShowPromtSwapModal, false);
    } catch (error) {
      console.log(error);
      errorCb();
      return;
    }

    let transaction = await window.SDK.waitForTransactionWithResult(trn.hash)
    if(transaction && transaction.success){
      dispatch(ActionTypes.GetTokenBalance, "notResetSelectToken");
      commit(MutationType.SetSlideInfo, null);
      commit(MutationType.SetTransaction, transaction);    
      setTimeout(() => {
        commit(MutationType.SetShowTransactionPopUp, true);
      }, 2000);
    }else{
      commit(MutationType.SetshowToast, "Transaction Failed");
      commit(MutationType.SetShowSwapResult, {
        status: null,
        visible: false,
      });
    }
    
  },

  async [ActionTypes.GetAnotherLpPosition]({ commit, state }) {
    const type =
      state.basedPosition === "top"
        ? "SetSelectTokenBottomValue"
        : "SetSelectTokenTopValue";
    const inValue =
      state.basedPosition === "top"
        ? state.selectedTokenTop.value
        : state.selectedTokenBottom.value;

    let { lp, lpRate } = state.currentLpData;
    let out_amount = 0;
    if (lp === "yx") {
      if (state.basedPosition === "top") {
        out_amount = inValue * (1 / lpRate);
      } else {
        out_amount = inValue / (1 / lpRate);
      }
    } else if (lp === "xy") {
      if (state.basedPosition === "top") {
        out_amount = inValue * (1 / lpRate);
      } else {
        out_amount = inValue / (1 / lpRate);
      }
    }
    commit(MutationType[type], formatDecimalsNum(out_amount, 'string', 10));
  },

  async [ActionTypes.AddLp]({ commit, state, dispatch }) {
    const errorCb = () => {
      commit(MutationType.SetShowPromtAddModal, true);
      commit(MutationType.SetAddConfirmModal, false);
      commit(MutationType.SetShowAddResult, {
        status:false,
        visible:false
      })
    }
    let { value:amount_x, address:coin_x, decimals:topDecimals } = state.selectedTokenTop        
    let { value:amount_y, address:cony_y, decimals:botDecimals } = state.selectedTokenBottom

    amount_x = parseInt(decimalToAmount(amount_x, topDecimals))
    amount_y = parseInt(decimalToAmount(amount_y, botDecimals))
    
    let coinXAdd
    let coinYAdd
    let coinXAmount
    let coinYAmount

    // create
    if (state.isAddOrCreateLp === "create") {
      coinXAdd = coin_x;
      coinYAdd = cony_y;
      coinXAmount = amount_x;
      coinYAmount = amount_y;
    } else {
      // add
      const allPools = localStorage.get('allPools')
      const exactItem = allPools.find(
        (item) => item.includes(coin_x) && item.includes(cony_y)
      );
      if (!(exactItem[0] === coin_x && exactItem[1] === cony_y)) {
        coinXAdd = cony_y;
        coinYAdd = coin_x;
        coinXAmount = amount_y;
        coinYAmount = amount_x;
      } else {
        coinXAdd = coin_x;
        coinYAdd = cony_y;
        coinXAmount = amount_x;
        coinYAmount = amount_y;
      }
    }

    let trn;
    commit(MutationType.SetAddConfirmModal, true);
    commit(MutationType.SetShowPromtAddModal, false);
    try {
      trn = await window.SDK.addLiquidity(
        coinXAdd,
        coinXAmount,
        coinYAdd,
        coinYAmount,
        state.slipage * 1000 || 1000,
        state.address,
        state.isAddOrCreateLp
      );
      if (!trn.hash) return errorCb();
      commit(MutationType.SetAddConfirmModal, false);
      commit(MutationType.SetShowAddResult, {
        status: true,
        visible: true,
      });
      commit(MutationType.SetShowPromtAddModal, false);
    } catch (error) {
      console.log(error);
      errorCb();
      return;
    }

    let transaction = await window.SDK.waitForTransactionWithResult(trn.hash)

    if(transaction && transaction.success && transaction.events.length){
      dispatch(ActionTypes.GetTokenBalance, "notResetSelectToken");
      commit(MutationType.SetTransaction, transaction);
      setTimeout(() => {
        commit(MutationType.SetShowTransactionAddPopUp, true);
      }, 2000);
    }else{
      commit(MutationType.SetshowToast, "Transaction Failed");
      commit(MutationType.SetShowAddResult, {
        status: null,
        visible: false,
      });
    }
    
  },

  async [ActionTypes.GetLpReserveData]({ commit, state, dispatch }, payload) {
    const coin_in = state.selectedTokenTop.address;
    const coin_out = state.selectedTokenBottom.address;
    let lpData;
      let data = await window.SDK.getReserveData(coin_in, coin_out);
      if(data){
        lpData = {
          coinXAddress: coin_in,
          coinYAddress: coin_out,
          coinXReserve: data.x,
          coinYReserve: data.y,
          lpRate: data.rate,
          lp: data.lp,
        };
      }else{
        lpData = null
      }
    commit(MutationType.SetCurrentLpData, lpData);
    if (lpData === null) return commit(MutationType.setIsAddOrCreate, "create");
    commit(MutationType.setIsAddOrCreate, "add");
    if (payload) {
      dispatch(ActionTypes.GetAnotherLpPosition);
    }
    const lpToken = await window.SDK.getTotalLpAmount(coin_in, coin_out);

    commit(MutationType.SetCurrentLpData, { ...lpData, ...lpToken });
  },

  async [ActionTypes.RemoveLiduidity]({ commit, state }, payload) {
    const { coinX, coinY, lpAmount, coinXOut, coinyOut } = state.removeData;

    const errorCb = () => {
      commit(MutationType.SetShowPromtRemoveModal, true);
      commit(MutationType.SetRemoveConfirmModal, false);
      commit(MutationType.SetShowRemoveResult, {
        status: false,
        visible: false,
      });
    };
    let trn;
    commit(MutationType.SetRemoveConfirmModal, true);
    commit(MutationType.SetShowPromtRemoveModal, false);

    try {
      trn = await window.SDK.removeLiquidity(
        coinX,
        coinY,
        lpAmount,
        coinXOut,
        coinyOut,
        state.slipage * 1000 || 1000,
        state.address
      );
      if (!trn.hash) return errorCb();
      commit(MutationType.SetRemoveConfirmModal, false);
      commit(MutationType.SetShowRemoveResult, {
        status: true,
        visible: true,
      });
      commit(MutationType.SetShowPromtRemoveModal, false);
    } catch (error) {
      console.log(error);
      errorCb();
      return;
    }

    let transaction = await window.SDK.waitForTransactionWithResult(trn.hash)
    if(transaction && transaction.success && transaction.events.length){
      commit(MutationType.SetTransaction, transaction);
      payload.callback && payload.callback();
      setTimeout(() => {
        commit(MutationType.SetShowTransactionRemovePopUp, true);
        commit(MutationType.SetShowRemoveResult, {
          status: null,
          visible: false,
        });
      }, 2000);
    }else{
      commit(MutationType.SetshowToast, "Transaction Failed");
      commit(MutationType.SetShowRemoveResult, {
        status: null,
        visible: false,
      });
    }    
  },
  async [ActionTypes.onNetworkChange]({ commit, state }) {
    const wallet = state.isAuthWallet;
    const isNotFewcha = ["aptos", "martian"].includes(wallet);
    if (isNotFewcha) {
      const network = await window[wallet].network();
      commit(MutationType.SetNetWork, network);
      window[wallet].onNetworkChange((network) => {
        if (wallet === "martian") {
          commit(MutationType.SetNetWork, network);
        } else {
          commit(MutationType.SetNetWork, network.networkName);
        }
      });
    }else if(wallet === 'fewcha'){
      let network = (await window?.fewcha.getNetwork()).data
      commit(MutationType.SetNetWork, network);
      window.addEventListener("aptos#changeNetwork", (e)=>{
        if (e.detail) {
          network = e.detail.name
          commit(MutationType.SetNetWork, network);
        }
      });
    }else if(wallet === 'Crypto.com'){
      let network = await window.deficonnect.aptos.network();
      commit(MutationType.SetNetWork, network);
      window.deficonnect.aptos.onNetworkChange((newNetwork) => {
        commit(MutationType.SetNetWork, newNetwork);
      });
    }
  },
  async [ActionTypes.loopGetPrice]({ getters, state }, { type, callback }) {
    callback({ type })
    if(window.timer){
      clearInterval(window.timer)
      window.timer = null
    }
    window.timer = setInterval(()=>{      
      if(getters.isFilledNumberBothPostion && !state.slideInfoLoading){
        callback({ type, isRefresh:true })
      }
    }, 5000)
  },
};
