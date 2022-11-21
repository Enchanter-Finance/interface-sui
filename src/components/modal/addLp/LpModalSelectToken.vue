<template>
   <vue-modal
    :show="show"
    @close="closeSelectTokenModal"
    title="Select a token"
    class="modal__select-token"
  >
    <div class="modal-search">
      <input ref="inputRef" @input="handleInput" class="modal-search__input" placeholder="Search name or address"/>
      <div class="modal-search__no-result" v-if="!showList.length">
        <span v-if="isLoading === false">No results found.</span>
        <VueSelectTokenSpinner v-if="isLoading" class="spinner"/>
      </div>
    </div>
    <div v-if="showList.length" class="modal-token-list">
      <div class="token-list__wrapper">
        <div
          class="token-list__item"
          v-for="token in showList"
          :class="{ isSelected: isGray(token), unClickable: isSelected(token) }"
          :key="token.id"
          @click="SetSelectTokenTop(token)"
        >
          <div class="setOpacity flex align--center">
            <img :src="getImgUrl(token.logo)" alt="" class="token-list__logo" />
            <div class="token-list__details">
              <div class="token-list__detailsTop" >
                <div class="token-list__symbol" v-text="token.symbol"></div>                
                <VueIdentify v-if="token.isOfficial" class="identify-icon"/>
              </div>
              <div class="token-list__name">
                <span v-text="token.name" />
                <span v-if="token.add_by_user" class="radius"></span>
                <span v-if="token.add_by_user">Added by user</span>
              </div>
            </div>
          </div>
          <div class="balance-txt">
            {{ formatDecimalsNum(token.balance) }}
          </div>
        </div>
      </div>
    </div>
  </vue-modal>
</template>

<script setup>

import useSearch from "@/utils/searchHooks";
import VueModal from "@/components/modal/VueModal.vue"
import { computed } from "vue"
import { useStore } from 'vuex'
import { MutationType } from "@/store/mutations"
import { ActionTypes } from "@/store/actions"
import VueTooltip from "@/components/tooltip/VueTooltip.vue"
import { formatDecimalsNum } from '@/utils/index'
import VueSelectTokenSpinner from "@/components/icons/VueSelectTokenSpinner.vue";
import VueIdentify from "@/components/icons/VueIdentify.vue";

defineProps({ show: Boolean });
const store = useStore()
const { 
  getImgUrl,
  address,
  selectedTokenTop,
  selectedTokenBottom,
  isLoading,
  isSearched,
  showList,
  handleInput,
  inputRef,
  isGray,
  showTokenConfirmModal,
  position,
  isSelected
} = useSearch('add');


const isSelectedBothPostion = computed(() => store.getters.isSelectedBothPostion)

const closeSelectTokenModal = () => {
  store.commit(MutationType.SetLpSelectTokenModal, { visible: false, position: position.value })
}

const SetSelectTokenTop = async (token) => {  
  if(isSelected(token)) return
  token = Object.assign(token, { value: ''})
  
  closeSelectTokenModal()

  if(position.value === "top" && token.address === selectedTokenBottom.value.address){

    exchangeTokenPosition(token, 'top')

  }else if(position.value === "bottom" && token.address === selectedTokenTop.value.address){

    exchangeTokenPosition(token, 'bottom')

  }else{
      position.value === "top" ? store.commit(MutationType.SetSelectTokenTop, token) : store.commit(MutationType.SetSelectTokenBottom, token)
  }    
  
  if(isSelectedBothPostion.value){
    let GetAnotgherAfterGetLpData = selectedTokenBottom.value.value || selectedTokenTop.value.value
    store.dispatch(ActionTypes.GetLpReserveData, GetAnotgherAfterGetLpData)
  }

}
  
const exchangeTokenPosition = (token, position)=>{
  
  const temp = position === "top" ? selectedTokenTop : selectedTokenBottom

  const {symbol, logo, address, value, ...others} = token

  const { symbol:tempSymbol, logo:tempLogo, address:tempAddress, value:tempValue, ...props } = temp.value

    store.commit(MutationType.SetSelectTokenTop, {
      symbol: position === "top" ?  token.symbol : tempSymbol,
      logo: position === "top" ?  token.logo : tempLogo,
      address: position === "top" ? token.address : tempAddress,
      value: '',
      ...(position === "top" ? others : props),
    })

    store.commit(MutationType.SetSelectTokenBottom, {
      symbol: position === "top" ?  tempSymbol : token.symbol,
      logo: position === "top" ?  tempLogo : token.logo,
      address: position === "top" ? tempAddress : token.address,
      value: '',
      ...(position === "top" ? props : others),
    })
}

</script>

