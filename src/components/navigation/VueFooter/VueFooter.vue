<template>
  <footer class="footer">
    <div class="footer_inner flex flex--column align--center">
      <div class="footer_inner--social flex justify--center">
        <div class="twitter" @click="toSocial('Twitter')">
          <img class="twitter-img" :src="Twitter" alt="" />
          <span class="twitter-txt">Twitter</span>          
        </div>
        <div class="discord" @click="toSocial('Discord')">
          <img class="discord-img" :src="Discord" alt="" />
          <span class="discord-txt">Discord</span>
        </div>
      </div>
      <span class="footer_inner--copyright">© 2022 Enchanter Finance. All Rights Reserved</span>
    </div>
  </footer>
</template>

<script>
import {  reactive, computed, toRefs } from "vue"
import { useStore } from 'vuex'
import Twitter from '@/assets/images/twitter.png'
import Discord from '@/assets/images/discord.png'

export default {
  name: "VueHeader ",  
  setup() {
    const toSocial = (link)=>{
      const linkMap = {        
        'About':'',
        'Twitter':'https://twitter.com/EnchanterFi',
        'Discord':'https://discord.gg/kAxTRj6YBt'
      }
      window.open( linkMap[link], '_blank');      
    }        
    return { toSocial, Twitter, Discord }
  },
}
</script>

<style lang="scss">
.footer {
  position: relative;
  bottom: 0;
  z-index: 1;
  left: 50%;
  width: 100%;  
  padding: 32px;
  transform: translateX(-50%);
  
  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    padding-bottom: 6vh;
  }
  &_inner{
    &--social{    
      
      color: #fff;
      font-weight: bold;
      font-size: 16px;
      .twitter,
      .discord {
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .twitter-txt {
        padding-left: 8px;
        font-weight: 300;
      }
      .discord-txt {
        padding-left: 9px;
      }
      .discord {
        margin-left: 32px;
        font-weight: 300;
      }
      .twitter-img {
        width: 22px;
        height: 19px;
      }
      .discord-img {
        width: 26px;
        height: 19px;
      }
    }
    &--copyright{
      padding-top: 16px; 
      font-weight: 300;     
      @media #{map-get($display-breakpoints, 'sm-and-down')} {
        font-size: 12px;
      }
    }
  }
}

</style>
