<template>
  <component
    :is="as"
    :disabled="isDisabled"
    :tabindex="isDisabled ? -1 : 0"
    :aria-hidden="isDisabled"
    :type="type"    
    :style="styleObj"    
    v-on="{
      click: onClick,
    }"
    :class="[
      'button',
      look === 'primary' ? 'button--primary' : null,
      look === 'main' && size === 'lg' ? 'button--main--lg' : null,
      look === 'disabled' && size === 'lg' ? 'button--disabled--lg' : null,
      look === 'outline' ? 'button--outline' : null,
      look === 'primary' && size === 'lg' ? 'button--primary--lg' : null,
      look === 'select' ? 'button--select' : null,
      icon === 'approve' ? 'button--approve' : null,
    ]"
  >
    <vue-approve
      v-if="icon === 'approve'"
      class="button__approve"
    ></vue-approve>
    <slot />
    <vue-icon-chevron-down
      v-if="look === 'select'"
      class="button__select__chevron"
    ></vue-icon-chevron-down>    
  </component>
</template>

<script>
import { computed } from "vue"
import { shirtSizeValidator, buttonStyleValidator } from "@/components/prop-validators"
import VueIconChevronDown from "@/components/icons/VueIconChevronDown.vue"
import VueApprove from "@/components/icons/VueApprove.vue"

export default {
  name: "VueButton",
  components: { VueIconChevronDown, VueApprove },
  props: {
    as: { type: String, default: "button" },
    icon: { type: String },
    styleObj: { type: Object },
    disabled: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    look: {
      type: String,
      validator: buttonStyleValidator,
      default: "secondary",
    },
    size: { type: String, validator: shirtSizeValidator, default: "md" },
    type: { type: String, default: "button" },
    href: { type: String, default: null },
  },
  setup(props, { emit }) {
    const isDisabled = computed(() => props.disabled)
    const isRegularLink = computed(() => props.as === "a")
    const onClick = (e) => {
      if (isRegularLink.value && isDisabled.value) {
        e.preventDefault()
        e.stopPropagation()
      }
      if (isDisabled.value === false) {
        emit("handleClick", e)
      }
    }
    return {
      isDisabled,
      isRegularLink,
      onClick,
    }
  },
}
</script>

<style lang="scss">
.button {
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  appearance: none;
  display: inline-block;
  text-align: center;
  line-height: inherit;
  text-decoration: none;
  font-size: inherit;
  padding: 8px 16px;
  color: white;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  &--approve{
   justify-content: flex-start!important; 

  }
  &__approve{
    width: 20px;
    height: 20px;
    background: radial-gradient(white 50%, rgba(255, 255, 255, 0) calc(75% + 1px), rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    box-shadow: black 0px 0px 1px;
    border: 0px solid rgba(255, 255, 255, 0);
  }
  
  &--main {
      &--lg {
        background: #8B54FF;
        color: white;
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
        &:hover{
          background-color: #5D34B4;
        }       
      }
  }
  &--disabled {
      &--lg {
        background: #281C4D;
        color: rgba(255, 255, 255, 0.7);
        font-size: 18px;
        font-weight: 500;
        padding: 20px;
        width: 100%;
        line-height: 1;
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
        cursor: auto;
        position: relative;
        z-index: 1;
        will-change: transform;
        transition: transform 450ms ease 0s;
        transform: perspective(1px) translateZ(0);          
      }
  }
  
  &--primary {
    font-weight: 500;
    background-color: rgba(21, 61, 111, 0.44);
    border: 1px solid rgba(21, 61, 111, 0.44);
    color: rgb(80, 144, 234);
    display: flex;
    flex-flow: row nowrap;
    -webkit-box-align: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 12px;
    user-select: none;
    font-size: 16px;
    transition: transform 450ms ease 0s;
    transform: perspective(1px) translateZ(0);

    &:hover {
      border: 1px solid rgba(49, 95, 154, 0.44);
      color: rgb(57, 130, 231);
    }

    &:focus {
      box-shadow: rgb(55 107 173 / 44%) 0 0 0 1pt;
    }

    &:active {
      box-shadow: rgb(55 107 173 / 44%) 0 0 0 1pt;
      border: 1px solid rgb(77, 143, 234);
    }

    &--lg {
      background-color: rgba(21, 61, 111, 0.44);
      color: rgb(80, 144, 234);
      font-size: 16px;
      font-weight: 500;
      padding: 16px;
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

      &:hover {
        background-color: rgba(19, 54, 98, 0.44);
        border-color: transparent;
      }
    }
  }

  &--outline {
    margin: 0;
    height: 38px;
    background-color: rgb(25, 27, 31);
    border: 1px solid rgb(25, 27, 31);
    padding: 0.15rem 0.5rem;
    border-radius: 12px;
    &:hover {
      cursor: pointer;
      outline: none;
      border: 1px solid rgb(64, 68, 79);
    }
  }

  &--select {
    visibility: visible;
    -webkit-box-align: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    background-color: rgb(25, 27, 31);
    color: rgb(255, 255, 255);
    border-radius: 16px;
    box-shadow: rgb(0 0 0 / 8%) 0 6px 10px;
    outline: none;
    cursor: pointer;
    user-select: none;
    border: none;
    width: initial;
    height: 2.4rem;
    padding: 0 8px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    margin-right: 12px;
    > svg {
      margin: 0 0.25rem 0 0.35rem;
      height: 35%;

      path {
        stroke: rgb(255, 255, 255);
        stroke-width: 1.5px;
      }
    }
  }
 
}
//
@include theme(button--outline) using ($mode) {
  background-color: map-get($mode, "button", "background");
  border: 1px solid rgb(25, 27, 31);

  path {
    stroke: map-get($mode, "button", "icon");
  }
}
</style>
