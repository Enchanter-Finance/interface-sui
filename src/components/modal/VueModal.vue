<template>
    <div v-if="show" class="modal">
      <div class="modal__content" aria-modal="true" role="dialog" aria-label="dialog">
        <div :class="['modal__header', isBack ? 'modal__header--back' : null]">
          <div class="modal__header__inner">
            <div class="modal__back" v-if="isBack" @click="onClose">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="cursor: pointer"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </div>
            <div class="modal__title">{{ title }}</div>
            <div v-if="showClose" class="modal__close">
              <vue-icon-times @click="onClose"></vue-icon-times>
            </div>
          </div>
        </div>
        <div class="modal__container">
          <slot />
        </div>
      </div>
      <div data-modal-overlay @click="onClose"></div>
    </div>
</template>

<script>

import { useKeydown } from "@/composables/use-keydown"
import VueIconTimes from "@/components/icons/VueIconTimes.vue"
export default {
  name: "VueModal",
  components: { VueIconTimes },
  props: {
    title: { type: String },
    show: { type: Boolean, default: false },
    closeOnEscape: { type: Boolean, default: true },
    isBack: { type: Boolean, default: false },
    showClose: { type: Boolean, default: true },
  },
  setup(props, { emit }) {
    const { onKeydown } = useKeydown()
    const onClose = () => emit("close")
    onKeydown((event) => {
      if (event.key === "Escape" && props.show === true && props.closeOnEscape === true) {
        onClose()
      }
    })

    return {
      onClose,
    }
  },
}
</script>

<style lang="scss">
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;  
  &__content {    
    background: #342A4A;
    backdrop-filter: blur(4px);
    box-shadow: rgb(0 0 0 / 5%) 0 4px 8px 0;
    align-self: center;
    max-width: 400px;
    display: flex;
    border-radius: 24px;
    z-index: 10;
    position: relative;
    flex-flow: column nowrap;
    margin: 0;
    padding: 0;
    width: 100%;
  }

  &__close {
    position: absolute;
    right: 1rem;
    top: 14px;

    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }

  &__header {
    display: flex;
    flex-flow: row nowrap;
    padding: 23px 24px 22px;
    font-weight: 500;
    color: inherit;    
    font-size: 18px;
    &--back {
      display: grid;
      grid-auto-rows: auto;
      font-weight: 500;
      font-size: 20px;
      border-bottom: 1px solid rgb(44, 47, 54);

      .modal__header__inner {
        width: 100%;
        display: flex;
        padding: 0;
        -webkit-box-align: center;
        align-items: center;
        justify-content: space-between;

        .modal__close {
          position: unset;
        }
      }
    }
  }

  &__title {
    text-decoration: none;
    color: rgb(255, 255, 255);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    line-height: 1;
  }

  &__container {
    padding: 0 24px 24px;
  }

  [data-modal-overlay] {
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.72);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>
