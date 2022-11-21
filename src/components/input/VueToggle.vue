<template>
  <div class="toggle">
    <input type="checkbox" class="toggle__checkbox" :checked="checked" />
    <div class="toggle__switch">
      <span>On</span>
    </div>
    <div class="toggle__layer"></div>
  </div>
</template>

<script>

export default {
  name: "VueToggle",
  props: {
    checked: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss">
.toggle {
  position: relative;
  width: 84px;
  height: 29px;
  overflow: hidden;
  border-radius: 12px;

  &__checkbox {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 3;
  }

  &__switch {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;

    &::before,
    &::after,
    span {
      position: absolute;
      top: 2px;
      width: 40px;
      height: 25px;
      text-align: center;
      border-radius: 9px;
      transition: 0.3s ease all;
      line-height: 26px;
    }

    &::before {
      content: "";
      left: 2px;
      background: #8B54FF;
    }

    &::after {
      content: "Off";
      right: 2px;
      color: rgb(195, 197, 203);
      font-size: 14px;
      font-weight: 500;

      &:hover {
        color: rgb(143, 150, 172);
      }
    }

    span {
      display: inline-block;
      left: 2px;
      color: #fff;
      z-index: 1;
      font-size: 14px;
      font-weight: 500;
    }
  }

  &__layer {
    width: 100%;
    background: rgb(25, 27, 31);
    transition: 0.3s ease all;
    z-index: 1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .toggle__checkbox {
    &:checked {
      + .toggle__switch {
        &::before {
          left: 42px;
          background: rgb(75, 78, 91);
          color: rgb(255, 255, 255);
          font-size: 14px;
          font-weight: 400;
        }

        span {
          color: #4e4e4e;
        }
      }
      + .toggle__switch::after {
        color: #fff;
      }
    }
  }
}
</style>
