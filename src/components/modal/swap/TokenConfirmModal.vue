<template>
  <vue-modal :show="show" :showClose="false" class="modal__token-confirm">
    <div class="token-confirm">
      <div class="token-confirm__token-wrapper flex flex--column align--center">
        <div class="token-wrapper-top flex align--center">
          <img class="token-logo" :src="getImgUrl(token.logo)" />
          <div class="token-right">
            <div class="token-symbol" v-text="token.symbol"></div>
            <div class="token-name" v-text="token.name"></div>
          </div>
        </div>        
        <div class="token-confirm__title flex align--center">
          <img :src="IconWarn" />
          <span>This token Isn't verified.</span>
        </div>
        <div class="token-confirm__description">
          Please do your own research before trading.
        </div>
        <div class="token-confirm__bottom">
          <div class="common-button confirm-button" @click="onOK">OK</div>
          <div class="common-button cancel-button" @click="closeTokenConfirmModal">Cancel</div>
        </div>
      </div>
    </div>
  </vue-modal>
</template>

<script>
import VueModal from "@/components/modal/VueModal.vue";
import { useStore } from "vuex";
import { MutationType } from "@/store/mutations";
import { ActionTypes } from "@/store/actions";
import IconWarn from "@/assets/images/icon_warn.png";
import { localStorage } from "@/utils/localStorage";

export default {
  props: {
    show: { type: Boolean, default: false },
    token: { type: Object, default: null },
  },
  components: { VueModal },
  setup(props) {
    const store = useStore();
    const getImgUrl = (logo) => new URL(`../../../assets/images/${logo || "default_token_logo.png"}`, import.meta.url).href;

    const closeTokenConfirmModal = () => {
      store.commit(MutationType.SetShowTokenConfirmModal, { token: null, visible: false, });
    };

    const onOK = () => {      
      let addedList = localStorage.get("userAddedTokens") || [];
      const toAddItem = { ...props.token, add_by_user: true }
      const list = [toAddItem, ...addedList];
      localStorage.set("userAddedTokens", list);      
      store.dispatch(ActionTypes.AddTokenItem, toAddItem);
      store.commit(MutationType.SetSelectTokenTop, toAddItem);
      closeTokenConfirmModal();
    };

    
    return {
      onOK,
      IconWarn,
      getImgUrl,
      closeTokenConfirmModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.token-confirm {
  &__token-wrapper {
    .token-wrapper-top{
      .token-logo{
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .token-right{
        padding-left: 6px;
        line-height: 1;
        font-weight: 500;
        
        .token-symbol{
          padding-bottom: 6px;
          font-size: 20px;
        }
        .token-name{
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }

  &__title {
    height: 43px;
    line-height: 43px;
    font-size: 24px;
    font-weight: 500;
    color: #fff;    
    margin-bottom: 2px;
    img {
      width: 24px;
      margin-right: 4px;
    }
  }

  &__description {
    height: 36px;
    line-height: 36px;
    font-size: 16px;
    color: #fff;
  }

  &__bottom {
    width: 100%;
    padding-top: 22px;
    .common-button{
        font-size: 18px;
        font-weight: 500;
        line-height: 1;
        padding: 20px;
        width: 100%;
        text-align: center;
        border-radius: 12px;
        outline: none;
        border: 1px solid transparent;
        text-decoration: none;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        z-index: 1;
        will-change: transform;
        transition: transform 450ms ease 0s;
        transform: perspective(1px) translateZ(0);   

        &.confirm-button{
          background: #8B54FF;
          color: white;
          &:hover{
            background-color: #5D34B4;
          } 
        }
         &.cancel-button{
          margin-top: 17px;
          background: #4C3C70;
          color: #8B54FF;
        }
    }
  }
}
</style>
