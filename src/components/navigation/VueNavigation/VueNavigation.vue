<template>
  <nav class="navbar__nav">
    <NavLink
      v-for="item in routers"      
      :key="item.path"
      :to="item.path"
      :name="item.name"
      class="navbar__nav__item"
      :class="{'isActive': isActive(item)}"
    >    
      {{ item.name }}
    </NavLink>
    <div @click="comingSoon" class="navbar__nav__item">Farm</div>
  </nav>
</template>

<script>

import NavLink from "@/components/navigation/VueLink/VueLink.vue"
import { MutationType } from "@/store/mutations"
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    name: "Navigation",
    components: { NavLink },
    props: {
      routers: {
        type: Object,
        required: true,
      },
    },
    setup(props) {
      const route = useRoute()      
      const store = useStore()
      const isActive = (item)=>{
        return item.name === 'Swap' && route.name === 'Swap' || item.multiples && item.multiples.includes(route.name)
      }
      const comingSoon = ()=>{        
        store.commit(MutationType.SetshowToast, 'Coming soon...')  
      }
    return { isActive, comingSoon }
  },
    
}
</script>

<style lang="scss">
.navbar {
  &__nav {
    justify-self: center;
    width: fit-content;
    padding: 8px 12px;
    border-radius: 24px;
    display: grid;
    grid-auto-flow: column;
    gap: 8px;
    overflow: auto;
    -webkit-box-align: center;
    align-items: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @media screen and (max-width: 1380px) {      
      position: absolute;
      left: 260px;
      top: 32px;
      z-index: 2;
    }

    &__item {
      display: flex;
      justify-content: center;
      flex-flow: row nowrap;
      border-radius: 24px;
      outline: none;
      cursor: pointer;
      text-decoration: none;
      color: rgb(60, 61, 65);
      font-size: 16px;
      font-weight: 500;    
      width: 96px;
      height: 32px;   
      line-height: 32px;
      word-break: break-word;
      overflow: hidden;
      white-space: nowrap;      

      &.router-link-active {
        text-align: center;
        width: 96px;
        border-radius: 24px;
        font-weight: 600;
        -webkit-box-pack: center;
        justify-content: center;
        color: rgb(255, 255, 255);
        background: rgba(255, 255, 255, 0.1);
      }
      .isActive{
        text-align: center;
        width: 80px;
        border-radius: 24px;
        font-weight: 600;
        -webkit-box-pack: center;
        justify-content: center;
        color: rgb(255, 255, 255);
        background: rgba(255, 255, 255, 0.1);
      }

      &:hover {
        color: rgb(230, 230, 230);
      }
    }
  }
}

@include theme(navbar__nav) using ($mode) {  
  background: #111;
  // .router-link-exact-active {
  //   color: map-get($mode, "navbar", "itemActive");
  //   background-color: map-get($mode, "navbar", "itemActiveBackground");
  // }
  .isActive{
    color: map-get($mode, "navbar", "itemActive");
    background-color: map-get($mode, "navbar", "itemActiveBackground");
  }

  &__item {
    color: map-get($mode, "navbar", "item");
  }
}
</style>
