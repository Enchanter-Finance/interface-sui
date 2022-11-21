<template>
  <div class="supply-info">
    <div class="supply-info_title">Prices and pool share</div>
    <!-- <div class="dot-line"></div> -->
    <div class="supply-info_bot">
      <div class="supply-info_block flex flex--space-between">
        <div class="supply-item">
          <div class="supply-item_num">{{formatDecimalsNum(selectedTokenTop.value / selectedTokenBottom.value)}}</div>
          <div class="supply-item_rate">{{selectedTokenTop.symbol}} per {{selectedTokenBottom.symbol}}</div>
        </div>
        <div class="supply-item">
          <div class="supply-item_num">{{formatDecimalsNum(selectedTokenBottom.value / selectedTokenTop.value)}}</div>
          <div class="supply-item_rate">{{selectedTokenBottom.symbol}} per {{selectedTokenTop.symbol}}</div>
        </div>
        <div class="supply-item">
          <div class="supply-item_num">{{share}}</div>
          <div class="supply-item_rate">Share of Pool</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { computed } from "vue"
import { useStore } from 'vuex'
const store = useStore()
import { formatDecimalsNum, decimalToAmount } from '@/utils/index'
let selectedTokenTop = computed(() => store.state.selectedTokenTop)

let selectedTokenBottom = computed(() => store.state.selectedTokenBottom)

let currentLpData = computed(() => store.state.currentLpData)

let share = computed(() => {
  if(currentLpData.value === null){
    return '100%'
  }else{
    const { value, decimals } = selectedTokenTop.value
    let percantage = decimalToAmount(value, decimals) / (currentLpData.value.coinXReserve + decimalToAmount(value, decimals)) * 100
    if(percantage < 0.01) return `<${0.01}%`
    return `${percantage.toFixed(2)}%`
  }
})

</script>

<style lang="scss">
.supply-info{  
  border: 1px solid #584A6F;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  padding: 0px;
  border-radius: 20px;
  box-sizing: border-box;
  &_title{
    padding: 16px 16px 16px 0;
    box-sizing: border-box;
    margin-left: 16px;
    margin-right: 16px;;
    border-bottom: 1px solid #584A6F;
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
  }
  &_bot{    
    padding: 14px 0 16px;
    box-sizing: border-box;
  }
  &_block{
    flex-wrap: wrap;
  }
  .supply-item{
    flex: 1;
    text-align: center;
    line-height: 1;
    &_num{
      color: #fff;
      
    }
    &_rate{
      font-weight: 500;
      font-size: 14px;
      color: #fff;
      opacity: 0.5;
      padding-top: 9px;
    }
  }
}
</style>