<script setup>
import { ref, useSlots, onMounted } from "vue";
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";

const pageData = new PageData()
pageData.get()
const route = useRoute()
let viewMode = Number(pageData.get().MilitaryCalisthenicsBefore) || 0
console.log('viewMode', pageData.get())
const num = window.languageData.MilitaryCalisthenicsBeforeSelected
viewMode = viewMode === 0 ? 0 : 1
const pageText = num[viewMode]


function change(val) {
  console.log(val)
}
console.log(pageText, viewMode)
</script>

<template>
  <div class="text-page">
    <img class="img" src="../assets/militaryCalisthenics.png" alt="" srcset="">
    <div class="title">{{ pageText.title }}</div>
    <div v-if="viewMode === 0" class="option1">
      <div class="subtitle description">
        <span class="gray">{{ pageText.text1[0] }}</span>
        <span class="">{{ pageText.text1[1] }}</span>
      </div>
      <div class="subtitle description">
        <span class="gray">{{ pageText.text2[0] }}</span>
        <span class="">{{ pageText.text2[1] }}</span>
        <span class="gray">{{ pageText.text2[2] }}</span>
      </div>
      <div class="btn1">
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div class="continue-btn" @click="emit('click')">
            <div>Continue</div>
            <img src="@/assets/select-item-icon.png">
          </div>
        </div>
      </div>

    </div>
    <div v-if="viewMode === 1" class="option2">
      <div class="subtitle description">
        <span class="gray">{{ pageText.text1[0] }}</span>
      </div>
      <div class="subtitle description">
        <span class="gray">{{ pageText.text2[0] }}</span>
        <span class="">{{ pageText.text2[1] }}</span>
      </div>
      <div class="btn2">
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div class="continue-btn" @click="emit('click')">
            <div>Continue</div>
            <img src="@/assets/select-item-icon.png">
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
}

.img {
  margin-top: 42px;
  width: 280px;
}

.title {}

.option1 {
  width: 592px;
  position: relative;
}

.option2 {
  width: 540px;
  position: relative;
}

.subtitle {
  width: 100%;
  margin-top: 24px;
}

.btn1 {
  position: absolute;
  bottom: -128px;
  right: -63px;
}

.btn2 {
  position: absolute;
  bottom: -118px;
  right: -89px;
}

@media (max-width: 600px) {

  .img {
    width: 180px;
  }

  .title {
    padding: 0 20px;
  }

  .option1,
  .option2 {
    width: 100vw;
  }

  .subtitle {
    width: 100vw;
    padding-right: 20px;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .btn1 {
    position: initial;
  }

  .btn2 {
    position: initial;
  }
}
</style>