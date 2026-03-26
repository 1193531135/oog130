<script setup>
import { ref, useSlots, onMounted } from "vue";
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";

const pageData = new PageData()
pageData.get()
const route = useRoute()
let viewMode = Number(pageData.get().StruggleWithFollowing) || 0
console.log('viewMode1', viewMode)
const num = window.languageData.StruggleWithFollowingSelected
const pageText = num[viewMode]


function change(val) {
  console.log(val)
}
console.log(pageText, viewMode)
</script>

<template>
  <div class="text-page">
    <!-- 1 -->
    <div v-if="viewMode === 0" class="box">
      <div class="title">{{ pageText.title }}</div>
      <div class="description">
        <span>{{ pageText.text1[0] }}</span>
        <span class="white">{{ pageText.text1[1] }}</span>
      </div>
      <div class="description">
        <span class="white">{{ pageText.text2[0] }}</span>
      </div>
      <div class="btn">
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div class="continue-btn" @click="emit('click')">
            <div>{{ pageText.continue }}</div>
            <img src="@/assets/select-item-icon.png">
          </div>
        </div>
      </div>
    </div>
    <!-- 2 -->
    <div v-if="viewMode === 1" class="box">
      <div class="title">{{ pageText.title }}</div>
      <div class="description">
        <span>{{ pageText.text1[0] }}</span>
        <span class="white">{{ pageText.text1[1] }}</span>
      </div>
      <div class="description">
        <span class="white">{{ pageText.text2[0] }}</span>
      </div>
      <div class="btn">
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div class="continue-btn" @click="emit('click')">
            <div>{{ pageText.continue }}</div>
            <img src="@/assets/select-item-icon.png">
          </div>
        </div>
      </div>
    </div>
    <!-- 3 -->
    <div v-if="viewMode === 2" class="box">
      <div class="title">{{ pageText.title }}</div>
      <div class="description">
        <span>{{ pageText.text1[0] }}</span>
        <span class="white">{{ pageText.text1[1] }}</span>
      </div>
      <div class="description">
        <span class="white">{{ pageText.text2[0] }}</span>
      </div>
      <div class="btn">
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div class="continue-btn" @click="emit('click')">
            <div>{{ pageText.continue }}</div>
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
  width: 540px;
  padding: 0 20.5px;
  box-sizing: border-box;

  .box {
    width: 100%;
  }

  .title {
    text-align: center;
  }

  .description {
    margin-top: 24px;
  }

  .btn {
    position: absolute;
    margin-left: 424px;
    margin-top: 84px;
  }
}

@media (max-width: 600px) {
  .text-page {
    width: 100vw;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
</style>