<template>  
  <div class="page-logo flex align--center">
    <img @click="toHome" class="logo-img cursor-pointer" src="@/assets/images/enchanter_logo.png" alt="">  
    <span class="logo-txt">Enchanter Finance</span>
  </div>
</template>

<script>

export default {
  name: "VueLogo",
  methods: {
    toHome() { this.$router.push({path:'/'}) }
  },
}
</script>

<style lang="scss">
.page-logo{
  .logo-img{
    width: 35px;    
  }
  .logo-txt{
    padding-left: 19px;
    font-size: 29px;
    font-weight: 800;
    font-family: 'Balance-Bold';
      @media screen and (max-width: 1380px) {      
        display: none;
      }
  }
}

</style>
