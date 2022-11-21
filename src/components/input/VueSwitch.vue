<template>
  <label class="switch">
    <input type="checkbox" id="togBtn" :checked="checked" />
    <div class="slider round">
      <!--ADDED HTML -->
      <span class="on">ON</span>
      <span class="off">OFF</span>
      <!--END-->
    </div>
  </label>
</template>

<script>

export default {
  name: "VueSwitch",
  props: {
    checked: { type: Boolean, default: true },
  },
}
</script>

<style lang="scss">
.switch {
  position: relative;
  display: inline-block;
  width: 73px;
  height: 37px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(33, 36, 41);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider::before {
  position: absolute;
  content: "";
  width: 24px;
  height: 24px;
  left: 7px;
  bottom: 7px;
  background-color: rgb(86, 90, 105);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider::before {
  background-color: #2196f3;
  transform: translateX(36px);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

.on {
  display: none;
  top: 9px;
  left: 14px;
}
.off {
  top: 9px;
  right: 10px;
  color: rgb(143, 150, 172);
}

.on,
.off {
  position: absolute;
  font-size: 14px;
  font-weight: 600;
}

input:checked + .slider .on {
  display: block;
}

input:checked + .slider .off {
  display: none;
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round::before {
  border-radius: 50%;
}
</style>
