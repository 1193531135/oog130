<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { PushControl } from '@/tool/index.js'
const pushControl = new PushControl()
const pageData = new PageData()
pageData
const route = useRoute()
let viewMode = Number(pageData.ChooserGender) || 0
const pageText = window.languageData[route.name]
viewMode = viewMode === 0 ? 0 : 1


function change(val) {
  pushControl.push()
}
</script>

<template>
  <div class="text-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle description">
      <span>{{ pageText.subtitle }}</span>
    </div>
    <div class="box">
      <img v-if="viewMode === 1" class="img" src="../assets/image/TaiChiBeginnerGuide_female.webp" alt="" srcset="">
      <img v-if="viewMode === 0" class="img" src="../assets/image/TaiChiBeginnerGuide_male.webp" alt="" srcset="">
      <div class="descriptionBox">
        <span>☯️</span>
        <span>{{ pageText.description }}</span>
      </div>
    </div>
    <div class="btn-container">
      <div class="continue-btn" @click="change">
        <div class="spacer"></div>
        <div>{{ pageText.continue }}</div>
        <img src="@/assets/continue-icon.webp">
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
  width: 100%;
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
  padding: 16px 16px 32px;
}

@media (max-width: 600px) {
  .text-page {
    position: relative;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
    padding: 0 16px;
    overflow-y: scroll;

    .box {
      position: absolute;
      top: 50%;
      box-sizing: border-box;
      margin: 0 16px;
      transform: translateY(-50%);
    }
  }

  .descriptionBox {
    font-size: 14px;
  }

  .img {
    width: 100%;
  }


}
</style>