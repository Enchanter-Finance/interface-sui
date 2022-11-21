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
    <div v-if="showList.length" class="token-list">
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
import VueModal from "@/components/modal/VueModal.vue";
import { useStore } from "vuex";
import { MutationType } from "@/store/mutations";
import { ActionTypes } from "@/store/actions";
import VueTooltip from "@/components/tooltip/VueTooltip.vue";
import { formatDecimalsNum } from "@/utils/index";
import VueSelectTokenSpinner from "@/components/icons/VueSelectTokenSpinner.vue";
import VueIdentify from "@/components/icons/VueIdentify.vue";

defineProps({ show: Boolean });
const store = useStore();

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
} = useSearch('swap');


const closeSelectTokenModal = () => {
  store.commit(MutationType.SetSwapSelectTokenModal, {
    visible: false,
    position: position.value,
  });
};

const AddSelectTokenTop = (token)=>{
  closeSelectTokenModal()
  showTokenConfirmModal(token)
}

const SetSelectTokenTop = async (token) => {
  if (isSelected(token)) return;
  store.commit(MutationType.setLpNotExist, false);
  if(isSearched.value){
    // open token confirm modal
    return AddSelectTokenTop(token)
  }
  token = Object.assign(token, { value: "" });
  const { symbol, logo, address, value, ...others } = token;
  store.commit(MutationType.ResetInputStatus);
  closeSelectTokenModal();

  if (position.value === "top" && token.address === selectedTokenBottom.value.address) {
    exchangeTokenPosition(token, "top");
  } else if (position.value === "bottom" && token.address === selectedTokenTop.value.address) {
    exchangeTokenPosition(token, "bottom");
  } else {
    store.commit(MutationType.ResetInputStatus);
    store.commit(position.value === "top" ? MutationType.SetSelectTokenTop : MutationType.SetSelectTokenBottom, {
        symbol: token.symbol,
        logo: token.logo,
        address: token.address,
        value: position.value === "top" ? selectedTokenTop.value.value : selectedTokenBottom.value.value,
        ...others,
      }
    );
    if (selectedTokenBottom.value.value || selectedTokenTop.value.value) {      

      store.dispatch(ActionTypes.loopGetPrice, { type: "selectToken", callback: getPrice });
      
    } else {
      position.value === "top" ? store.commit(MutationType.SetSelectTokenTop, token) : store.commit(MutationType.SetSelectTokenBottom, token);
    }
  }
};

const exchangeTokenPosition = (token, position) => {
  
  store.commit(MutationType.SetBasedPosition, store.state.basedPosition === "top" ? "bottom" : "top");

  const previousTop = {...selectedTokenTop.value}
  const previousBot = {...selectedTokenBottom.value}
  
  store.commit(MutationType.SetSelectTokenTop, previousBot);
  store.commit(MutationType.SetSelectTokenBottom, previousTop); 
  

  if((position === "top" && !selectedTokenBottom.value.value) || (position === "bottom" && !selectedTokenTop.value.value)){
  }else{
    store.dispatch(ActionTypes.loopGetPrice, { type: "swapCurrency", callback: getPrice });
  }
};

const getPrice = (params)=>{
  store.dispatch(ActionTypes.GetAnotherSwapPosition, params);
}


</script>

<style lang="scss">
.modal-search {
  margin-bottom: 33px;

  &__input {
    width: 100%;
    height: 46px;
    border-radius: 45px;
    border: 2px solid #8b54ff;
    background-color: transparent;
    background-image: url("@/assets/images/icon_search.png");
    background-size: 16px 16px;
    background-repeat: no-repeat;
    background-position: 315px 13px;
    font-size: 16px;
    color: #fff;
    padding-left: 16px;
    padding-right: 48px;

    &:focus {
      outline: none;
    }
  }

  &__no-result {
    position: relative;
    overflow: auto;
    will-change: transform;
    height: 45vh;
    text-align: center;

    span {
      display: block;
      font-size: 16px;
      text-align: center;
      height: 100%;
      margin-top: 16px;
      border-top: 1px solid #584a6f;
      padding-top: 159px;
    }
  }

  .spinner {
    margin-top: 145px;
    width: 22px;
    height: 22px;
    animation: 2s rotate linear infinite;
  }
}

.token-list {
  position: relative;
  overflow: auto;
  will-change: transform;  
  max-height: 45vh;

  &__wrapper {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    padding-bottom: 3px;
  }

  &__item {
    width: 100%;
    cursor: pointer;
    opacity: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #4c3c70;
    border-radius: 12px;
    border: 2px solid #4c3c70;
    padding: 16px;
    &:hover {
      border: 2px solid #8b54ff;
    }
    & + .token-list__item {
      margin-top: 16px;
    }
    &.isSelected {
      .setOpacity {
        opacity: 0.5;
      }
    }
    &.unClickable {
      cursor: auto;
      &:hover {
        border: 2px solid transparent;
      }
    }
  }

  &__logo {
    width: 32px;
    height: 32px;
    box-shadow: rgb(0 0 0 / 8%) 0 6px 10px;
    border-radius: 50%;
  }

  &__details {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    line-height: 1;
    padding-left: 14px;
    font-size: 16px;
    .token-list__detailsTop{
      display:flex;
      align-items:center;
      .token-list__symbol{
        box-sizing: border-box;
        margin: 0;
        min-width: 0;
        font-weight: 500;
        line-height: 1;
      }
      .identify-icon{
        margin-left: 4px;
      }      
    }
  }

  
  &__name {
    box-sizing: border-box;
    margin: 0;
    min-width: 0;
    font-weight: 300;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    padding-top: 4px;
    display: flex;
    align-items: center;
    line-height: 1;
    .radius{
      display: inline-block;
      width: 3px;
      height: 3px;
      margin: 0 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
    }
  }
}
</style>
