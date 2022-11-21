import { CELER_COIN_ADDRESS, APTOS_ADDRESS } from '@/libs/enchanter.ts'

export const getters = {  
  isSelectedBothPostion(state){   
    return state.selectedTokenTop.address && state.selectedTokenBottom.address
  },
  isFilledNumberBothPostion(state){   
    return state.selectedTokenTop.value && state.selectedTokenBottom.value
  },
  isNotExistsPair(state){
    const topAddr = state.selectedTokenTop.address
    const botAddr = state.selectedTokenBottom.address
    if(!topAddr || !botAddr) return false
    if(topAddr.indexOf(CELER_COIN_ADDRESS) !== -1 && botAddr !== APTOS_ADDRESS){
      return true
    }else if(botAddr.indexOf(CELER_COIN_ADDRESS) !== -1 && topAddr !== APTOS_ADDRESS){
      return true
    }else{
      return false
    }
  }
}


