<template>
  <div :style="columnStyle" :class="columnClasses">
    <slot />
  </div>
</template>

<script>
import {  getCurrentInstance, ref } from "vue"
export default {
  name: "VueColumn",
  props: {
    xs: [Number, String],
    sm: [Number, String],
    md: [Number, String],
    lg: [Number, String],
    xl: [Number, String],
    xsOffset: {
      type: Number,
      required: false,
    },
    smOffset: {
      type: Number,
      required: false,
    },
    mdOffset: {
      type: Number,
      required: false,
    },
    lgOffset: {
      type: Number,
      required: false,
    },
    xlOffset: {
      type: Number,
      required: false,
    },
    order: {
      type: Number,
      required: false,
    },
  },

  setup(props) {
    const internalInstance = getCurrentInstance()
    let columnStyle = ref("")
    let columnClasses = ref("col")
    columnStyle.value +=
      props.xs || props.sm || props.md || props.lg || props.xl ? `--col: 0;` : `--col: 1;`
    columnStyle.value += props.order || props.order === 0 ? `--order: ${props.order};` : false

    const getValue = (breakpoint) => {
      const localColumns = (internalInstance?.parent?.props ).columns
      if (breakpoint > localColumns) {
        breakpoint = localColumns
      }
      return breakpoint ? `${(breakpoint / localColumns) * 100}%` : false
    }

    const createClassSize = () => {
      let newClass = "col col--xs "
      newClass += props.sm ? "col--sm " : ""
      newClass += props.md ? "col--md " : ""
      newClass += props.lg ? "col--lg " : ""
      newClass += props.xl ? "col--xl " : ""
      newClass += props.xsOffset ? "col--offset--xs " : ""
      newClass += props.smOffset ? "col--offset--sm " : ""
      newClass += props.mdOffset ? "col--Offset--md " : ""
      newClass += props.lgOffset ? "col--Offset--lg " : ""
      newClass += props.xlOffset ? "col--Offset--xl " : ""

      return (columnClasses.value = newClass)
    }

    const createStyleSize = () => {
      let newStyle = ""
      // Scale
      newStyle += props.xs ? `--xsWidth:${getValue(props.xs)}; ` : `--xsWidth:100%; `
      newStyle += props.sm ? `--smWidth:${getValue(props.sm)}; ` : ""
      newStyle += props.md ? `--mdWidth:${getValue(props.md)}; ` : ""
      newStyle += props.lg ? `--lgWidth:${getValue(props.lg)}; ` : ""
      newStyle += props.xl ? `--xlWidth:${getValue(props.xl)}; ` : ""
      // Offset
      newStyle += props.xsOffset ? `--xsOffset:${getValue(props.xsOffset)}; ` : ``
      newStyle += props.smOffset ? `--smOffset:${getValue(props.smOffset)}; ` : ""
      newStyle += props.mdOffset ? `--mdOffset:${getValue(props.mdOffset)}; ` : ""
      newStyle += props.lgOffset ? `--lgOffset:${getValue(props.lgOffset)}; ` : ""
      newStyle += props.xlOffset ? `--xlOffset:${getValue(props.xlOffset)}; ` : ""

      return (columnStyle.value += newStyle)
    }

    createClassSize()
    createStyleSize()

    return { columnStyle, columnClasses, createClassSize, createStyleSize }
  },
}
</script>

<style lang="scss">
.col {
  position: relative;
  box-sizing: border-box;
  flex-grow: var(--col);
  padding: var(--padding);
  order: var(--order);
}
.col--xs {
  flex-basis: var(--xsWidth);
  max-width: var(--xsWidth);
}
.col--offset--xs {
  margin-left: var(--xsOffset);
}
@media #{map-get($display-breakpoints, 'lg-and-up')} {
  .col--sm {
    flex-basis: var(--smWidth);
    max-width: var(--smWidth);
  }
  .col--offset--sm {
    margin-left: var(--smOffset);
  }
}
@media #{map-get($display-breakpoints, 'sm-and-up')} {
  .col--md {
    flex-basis: var(--mdWidth);
    max-width: var(--mdWidth);
  }
  .col--offset--md {
    margin-left: var(--mdOffset);
  }
}
@media #{map-get($display-breakpoints, 'md-and-up')} {
  .col--lg {
    flex-basis: var(--lgWidth);
    max-width: var(--lgWidth);
  }
  .col--offset--lg {
    margin-left: var(--lgOffset);
  }
}
@media #{map-get($display-breakpoints, 'lg-and-up')} {
  .col--xl {
    flex-basis: var(--xlWidth);
    max-width: var(--xlWidth);
  }
  .col--offset--xl {
    margin-left: var(--xlOffset);
  }
}
</style>
