<template>
  <div class="tabs">
    <div class="tabs__header">
      <div
        v-for="(title, index) in tabTitles"
        :key="index"
        @click="selectedTitle = title"
        :class="['tabs__item', title === selectedTitle ? 'tabs__item--active' : null]"
      >
        {{ title }}
      </div>
    </div>
  </div>
  <slot></slot>
</template>

<script>
import {  ref, provide } from "vue"

export default {
  name: "VueTabs",
  setup(props, { slots }) {
    const tabTitles = ref(slots.default().map((tab) => tab.props.title))
    const selectedTitle = ref(tabTitles.value[0])

    provide("selectedTitle", selectedTitle)

    return { selectedTitle, tabTitles }
  },
}
</script>

<style lang="scss">
.tabs {
  display: grid;
  grid-auto-rows: auto;
  padding: 20px 0 0;

  &__header {
    background-color: rgb(64, 68, 79);
    border-radius: 12px;
    padding: 6px;
    justify-content: space-between;
    width: 100%;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }

  &__item {
    width: 48%;
    padding: 10px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-radius: 12px;
    font-weight: 600;
    background-color: rgb(64, 68, 79);
    color: rgb(195, 197, 203);
    user-select: none;
    cursor: pointer;

    &--active {
      background-color: rgb(33, 36, 41);
      color: rgb(255, 255, 255);
      cursor: default;
    }
  }
}
</style>
