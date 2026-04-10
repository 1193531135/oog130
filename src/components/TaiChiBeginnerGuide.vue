<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'

const pageData = new PageData()
pageData
const route = useRoute()
let viewMode = Number(pageData.ChooserGender) || 0
console.log('viewMode', pageData)
const pageText = window.languageData[route.name]
viewMode = viewMode === 0 ? 0 : 1


function change(val) {
  console.log(val)
  push()
}
console.log(pageText, viewMode)
</script>

<template>
  <div class="text-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle description">
      <span>{{ pageText.subtitle }}</span>
    </div>
    <img v-if="viewMode === 1" class="img" src="../assets/image/TaiChiBeginnerGuide_female.png" alt="" srcset="">
    <img v-if="viewMode === 0" class="img" src="../assets/image/TaiChiBeginnerGuide_male.png" alt="" srcset="">
    <div class="descriptionBox">
      <span>☯️</span>
      <span>{{ pageText.description }}</span>
    </div>
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
  max-width: 530px;
}

.img {
  margin-top: 20px;
  width: 410px;
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

.descriptionBox {
  width: 100%;
  margin-top: 20px;
  display: flex;

  padding: 16px;
  align-items: center;
  gap: 12px;
  background-color: #EDF0F3;
  border-radius: 8px;
  font-size: 15px;
  color: #959799;
  box-sizing: border-box;
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