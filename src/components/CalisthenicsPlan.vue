<script setup>
import {ref} from "vue";
import {PageData, push} from "@/tool/index.js";
import {useRoute} from "vue-router";

const route = useRoute()
const data = ref([])
const image = ref([])
const pageText = window.languageData[route.name]

const pageData = new PageData();


const startVal = Number(pageData["CurrentWeight"].weight)
const endVal = Number(pageData["TargetWeight"].weight)

image.value = startVal > endVal ?
    new URL("@/assets/image/calisthenicsPlan-down.webp", import.meta.url) :
    new URL("@/assets/image/calisthenicsPlan-up.webp", import.meta.url);

startVal === endVal && (image.value =  new URL("@/assets/image/calisthenicsPlan-flat.webp", import.meta.url));

// data.value[0].value = pageData["CurrentWeight"]
// data.value[2].value = pageData["TargetWeight"]
function change() {
  push()
}

</script>

<template>
  <div class="select-page-con">
    <div class="title">
      <div class="special">{{ pageData["UserName"] }},</div>
      <div>{{ pageText.title[0] }}</div>
    </div>
    <div class="month">{{ pageText.textBox.month }}</div>
    <div class="trend-line" >
      <img :src="image">
    </div>
    <div class="end-text">{{ pageText.textBox.text }}</div>
    <div class="btn-container" style="justify-content:right">
      <div class="continue-btn" @click="change">
        <div>{{ pageText.continue }}</div>
        <img src="@/assets/select-item-icon.webp">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.select-page-con {
  padding: 0 0 20px;
  max-width: 498px;
  box-sizing: border-box;
  text-align: center;
  font-feature-settings: 'liga' off, 'clig' off;
  display: flex;
  flex-direction: column;
  align-items: start;

  .title {
    font-family: Laien, serif;
    font-size: 35px;
    font-weight: 700;
    width: 680px;
    text-align: left;
    margin-bottom: 24px;
    .special{
      color: var(--style-color);
    }
  }

  .month{ text-align: left;width: 100% }

  .trend-line{
    margin-top: 20px;
    border: none;
    width: 447px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .end-text{
    margin: 22px 0;
    text-align: left;
    width: 100%;
    color: #AAAAAA;
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 24px;

    .title {
      font-size: 28px;
      width: 100%;
    }
    .trend-line{
      margin-top: 0;
      width: 100%;
    }
  }
}
</style>