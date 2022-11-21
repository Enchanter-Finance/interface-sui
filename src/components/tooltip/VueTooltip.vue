<template>
  <component
    :is="as"
    :class="['vue-tooltip', show ? 'show' : null, direction]"
    :data-tip="tip"
    @mouseenter.stop.prevent="onEnter"
    @mouseleave.stop.prevent="onLeave"
    @touchend.stop.prevent="onTouchEnd"
  >
    <slot />
  </component>
</template>

<script>
import {  ref } from "vue"
export default {
  name: "VueTooltip",
  props: {
    as: { type: String, default: "span" },
    tip: { type: String, required: true },
    direction: { type: String, default: "top" },
  },
  setup(props) {
    const show = ref(false)
    const onEnter = () => {
      show.value = true
    }
    const onLeave = () => {
      show.value = false
    }
    const onTouchEnd = () => {
      if (props.disabled === false) {
        show.value = !show.value
      }
    }
    return {
      show,
      onEnter,
      onLeave,
      onTouchEnd,
    }
  },
}
</script>

<style lang="scss">
.vue-tooltip {
  display: inline-flex;
  align-items: flex-end;
  position: relative;
  border-bottom: 1px dashed transparent;
  font-weight: 400;
  word-break: break-word;
  font-size: 16px;
  line-height: 1.3;
  &::before,
  &::after {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    left: 50%;
    transition: visibility 150ms linear 0s, opacity 150ms linear 0s;
    transition-property: opacity;
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;
  }

  &::before {
    z-index: 9998;
    color: #fff;
    content: attr(data-tip);
    display: block;
    pointer-events: none;
    width: 256px;
    padding: 18px;
    font-weight: 400;
    word-break: break-word;
    background: #4C3C70;
    border-radius: 12px;
    border: 2px solid #5A4975;
    box-shadow: rgb(0 0 0 / 10%) 0 4px 8px 0;
    transform: translateX(-50%);
  }

  // &::after {
  //   width: 8px;
  //   height: 8px;
  //   z-index: 9999;
  //   content: "";
  //   border: 2px solid #5A4975;
  //   transform: rotate(45deg) translateX(-50%);
  //   background: #4C3C70;
  //   border-bottom: none;
  //   border-right: none;
  //   top: 28px;
  // }
  &.top {
    &::before {
      bottom: calc(100% + 0%);
    }
  }
  &.bottom-right {
    &::before {      
      top: 150%;
      left: 100px;
    }
  }
   &.right {
    &::before {      
      top: -200%;
      left: 200px;
    }      
  }
  &.bottom {
    &::before {
      top: 150%;
    }
  }
  &.show {
    &::before,
    &::after {
      visibility: visible;
      opacity: 1;
    }
  }

  &__inner {
    font-size: 14px;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }

    &--shift--left {
      margin-left: 4px;
    }
  }

  &--rounded {
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 0;
    width: 18px;
    height: 18px;
    border: none;
    background: none rgb(44, 47, 54);
    outline: none;
    cursor: default;
    border-radius: 36px;
    font-size: 12px;
    color: rgb(195, 197, 203);
  }
}
</style>
