<script setup>
import { useRoute } from 'vue-router'
import { push } from '@/tool/index.js'
const route = useRoute()
const pageText = window.languageData[route.name]

function change(){
  //
  push()
}
</script>

<template>
  <div class="text-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="description">{{ pageText.text1 }}</div>
    <img class="img" src="../assets/Over70million.png" alt="" srcset="">
    <div class="btn-container" style="justify-content:right">
      <div class="continue-btn" @click="change">
        <div>Continue</div>
        <img src="@/assets/select-item-icon.png">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .img{
    width: 343px;
  }
</style>