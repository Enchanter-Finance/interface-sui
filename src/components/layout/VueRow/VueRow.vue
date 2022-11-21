<template>
  <div :style="rowStyle" class="row">
    <slot />
  </div>
</template>

<script>


export default {
  name: "VueRow",
  props: {
    gutter: {
      type: Number,
      required: false,
      default: 0,
    },
    columns: {
      type: Number,
      default: 12,
    },
  },

  setup(props) {
    const rowStyle = createGutter(props.gutter)

    return { rowStyle }
  },
}

const createGutter = (gutter) => {
  return gutter
    ? `--paddingRow: ${gutter / 2}px; --marginRow: -${gutter / 2}px`
    : "--paddingRow: 0px; --marginRow: 0px"
}
</script>

<style lang="scss">
.row {
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + (var(--paddingRow) * 2));
  margin: var(--marginRow);
}
</style>
