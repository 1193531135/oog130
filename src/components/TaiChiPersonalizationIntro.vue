<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'

const pageData = new PageData()
pageData
const route = useRoute()
const pageText = window.languageData[route.name]


function change(val) {
  console.log(val)
  push()
}
</script>

<template>
  <div class="text-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle description">
      <span>{{ pageText.subtitle }}</span>
    </div>
    <img class="img" src="../assets/image/TaiChiPersonalizationIntro.png" alt="" srcset="">
    <div class="btn-container">
      <div class="continue-btn" @click="change">
        <div class="spacer"></div>
        <div>{{ pageText.continue }}</div>
        <img src="@/assets/continue-icon.png">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.text-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 660px;
}

.img {
  margin-top: 20px;
  width: 530px;
}

.title {
  
  width: 100%;
  text-align: center;
}

.subtitle {
  margin-top: 16px;
  width: 100%;
  text-align: center;
}


.btn-container {
  position: fixed;
  height: 100px;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 16px 16px 12px;
}

@media (max-width: 600px) {
  .text-page {
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 0 20px;
    overflow-y: scroll;
  }

  .img {
    width: 180px;
  }


}
</style>