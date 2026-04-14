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
    <div class="box">
      <div class="title">{{ pageText.title }}</div>
      <div class="description">
        <span>{{ pageText.subtitle }}</span>
      </div>
      <img class="img" src="@/assets/ExperienceSimilarSymptoms.webp" alt="Military Calisthenics">
      <div class="btn">
        <div class="btn-container">
          <div class="continue-btn" @click="change">
            <div>{{ pageText.continue }}</div>
            <img src="@/assets/select-item-icon.webp">
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<style scoped lang="less">
.text-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 580px;
  // padding: 0 20.5px;
  box-sizing: border-box;

  .box {
    width: 100%;
  }

  .title {
    text-align: center;
  }

  .description {
    margin-top: 24px;
    width: 100%;
    text-align: center;
    padding: 0 30px;
    box-sizing: border-box;
  }

  .img {
    width: 503px;
  }

  .btn {
    position: absolute;
    margin-left: 424px;
    margin-top: 12px;
  }
}

@media (max-width: 600px) {
  .text-page {
    width: 100vw;
    padding: 0 20px;
    box-sizing: border-box;
    .img {
      width: 100%;
    }
  }
}
</style>