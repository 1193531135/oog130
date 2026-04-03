<script setup>
import LineChart from "@/components/module/LineChart.vue";
import {ref} from "vue";
import {PageData, push} from "@/tool/index.js";
import {useRoute} from "vue-router";

const route = useRoute()
const data = ref([])
const pageText = window.languageData[route.name]

data.value = pageText.textBox.timeType.map(i => {
  return {
    label: i,
  }
})
const pageData = new PageData()
data.value[0].value = pageData["CurrentWeight"]
data.value[1].value = pageData["CurrentWeight"]
data.value[2].value = pageData["TargetWeight"]

function change() {
  push()
}

</script>

<template>
  <div class="select-page-con">
    <div class="title">
      {{ pageText.title[0] }}
      <span>{{ pageText.title[1] }}</span>
      {{ pageText.title[2] }}
    </div>
    <div class="subtitle">{{ pageText.subtitle }}</div>
    <div class="month">{{ pageText.textBox.month }}</div>
    <div class="trend-line" >
      <LineChart :lineChartData="data"></LineChart>
    </div>
    <div class="end-text">{{ pageText.textBox.text }}</div>
    <div class="btn-container" style="justify-content:right">
      <div class="continue-btn" @click="change">
        <div>{{ pageText.continue }}</div>
        <img src="@/assets/select-item-icon.png">
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
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-family: Laien, serif;
    font-size: 39px;
    font-weight: 700;
    width: 100%;
    margin-bottom: 24px;
    span{
      color: var(--style-color);
    }
  }
  .subtitle{
    margin-bottom: 24px;
  }
  .month{ text-align: left;width: 100% }

  .trend-line{
    margin-top: 61px;
    border: none;
    width: 479px;
    height: 295px;
  }
  .end-text{
    margin: 24px 0;
    text-align: left;
    width: 100%;
    color: #AAAAAA;
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 24px;

    .title {
      font-size: 28px
    }
    .trend-line{
      margin-top: 0;
      border: none;
      width: 100%;
    }
  }
}
</style>