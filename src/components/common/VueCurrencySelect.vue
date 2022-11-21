<template>
  <vue-button
    look="select"
    :class="[
      'currency-select',
      isSelected ? null : 'currency-select--selected',
    ]"
  >
    <div class="currency-select__container">
      <img
        :src="getImgUrl(token.logo)"
        alt="logo"
        class="currency-select__logo"
        v-if="isSelected"
      />
      <span
        class="currency-select__name"
        v-text="isSelected ? token.symbol : 'Select token'"
      ></span>
    </div>
  </vue-button>
</template>

<script>
import VueButton from "@/components/button/VueButton.vue";

export default {
  name: "VueCurrencySelect",
  props: {
    isSelected: {
      type: Boolean,
      default: false,
    },
    token: {
      symbol: String,
      logo: String,
    },
  },
  setup() {
    const getImgUrl = (logo) => new URL(`../../assets/images/${logo || "default_token_logo.png"}`, import.meta.url).href;

    return { getImgUrl };
  },
  components: { VueButton },
};
</script>

<style lang="scss" scoped>
.currency-select {
  width: initial;
  height: 40px;
  visibility: visible;
  -webkit-box-align: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  background-color: #111;
  color: rgb(255, 255, 255);
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 8%) 0 6px 10px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 12px 0 8px;
  margin-right: 16px;
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: rgb(44, 47, 54);
  }

  &--selected {
    background-color: #dab642;
    color: #fff;
    padding: 0 12px 0 12px;
    &:hover {
      background-color: #bd9710;
    }
  }

  &__container {
    width: fit-content;
    display: flex;
    padding: 0;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: start;
    justify-content: flex-start;

    > img {
      width: 24px;
      height: 24px;
      box-shadow: rgb(0 0 0 / 8%) 0 6px 10;
      border-radius: 24px;
    }
  }

  &__name {
    margin: 0 2px;
    font-size: 16px;
  }

  &__logo {
    margin-right: 6px;
  }
}
</style>
