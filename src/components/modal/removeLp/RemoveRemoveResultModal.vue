<template>
  <vue-modal
    :show="show.visible"
    @close="close"
    :title="show.status ? 'Success' : 'Error'"
    class="modal__swapResult"
  >
    <div class="modal__swapResult--wrapper flex flex--column align--center">

      <template v-if="!show.status">
        <svg style="margin-top: 16px;" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M59.5 66.5L59.5 47.5" stroke="#EB264A" stroke-width="4" stroke-linecap="round"/>
          <path d="M59.5 75.5L59.5 78.5" stroke="#EB264A" stroke-width="4" stroke-linecap="round"/>
          <path d="M53.3226 25.1199C56.4846 20.3278 63.5154 20.3278 66.6774 25.1199L103.776 81.3441C107.285 86.6629 103.471 93.75 97.0983 93.75H22.9017C16.5293 93.75 12.7147 86.6629 16.2243 81.3441L53.3226 25.1199Z" stroke="#EB264A" stroke-width="4"/>
        </svg>
        <span class="rejected-text">Transaction rejected.</span>
      </template>

      <template v-else>
        <svg class="road-up" width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="58" stroke="#8B54FF" stroke-width="4"/>
          <path d="M78 58.4995L59.5594 40.0589L41.1188 58.4995" stroke="#8B54FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M59.5 41.5L59.5 78.5" stroke="#8B54FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="has-submitted">Transaction Submitted</span>
        <a class="explorer" href="https://explorer.aptoslabs.com/?network=testnet" target="_blank">View on Explorer</a>
      </template>
    </div>
    
    <vue-button class="flex" size="lg" look="main" @handleClick="close">
      <span class="options__wallet-content">Close</span>
    </vue-button>

  </vue-modal>

</template>
<script>
import { reactive, toRefs } from 'vue'
import VueModal from "@/components/modal/VueModal.vue"
import { useStore } from 'vuex'
import VueButton from "@/components/button/VueButton.vue"
import { MutationType } from "@/store/mutations"
export default {
  components:{
    VueModal,
    VueButton
  },
   props: {
    show: {
      type: Object,
      default: {}
    },
  },
  setup (props) {
    const store = useStore()
    const close = ()=>{
      store.commit(MutationType.ResetRemoveModal)
      store.commit(MutationType.SetShowTransactionRemovePopUp, true)

    }
    
    return {
      close
    }
  }
}
</script>

