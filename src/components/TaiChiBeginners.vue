<script setup>
import {ref} from 'vue'
import Select from './module/select.vue'
import { PushControl } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'
const pushControl = new PushControl()

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(pageData[route.name])

const options = pageText.selectOptions.map((i, index) => ({label: i, value: index}))

function change(val){
  // 存储数据
  pageData.set(route.name,val)
  //
  pushControl.push()
}
</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle">{{ pageText.subtitle }}</div>
    <div class="content">
      <img src="../assets/start.webp">
      <div class="select-con">
        <Select v-model="selectValue" :options="options" class="select" @change="change">
          <template #default="{ itemData }">
            <div>{{ itemData.label }}</div>
            <img src="../assets/select-item-icon.webp">
          </template>
        </Select>
      </div>
    </div>
    <div class="end-text">
      <span>{{ pageText.text[0] }}</span>
      <span class="special-text">{{ pageText.text[1] }}</span>
      <span>{{ pageText.text[2] }}</span>
      <span class="special-text">{{ pageText.text[3] }}</span>
      <span>{{ pageText.text[4] }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.select-page-con{
  max-width: 767px;
  text-align: center;
  box-sizing: border-box;
  padding:0 16px;
  .title {
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .subtitle{
    font-size: 24px;
    margin-bottom: 44px;
    color: #959799;
    font-weight: 500;
  }
  .content {
    display: flex;
    gap: 32px;
    > img {
      width: 377px;
      height: 470px;
    }
    .select-con{
      width: 358px;
      text-align: center;
      .select {
        /deep/ .select-item {
          justify-content: space-between;
          > img {
            width: 30px;
            height: 30px;
          }
        }
        margin-bottom: 24px;
      }
    }
  }
  .end-text{
    margin-top: 16px;
    font-size: 14px;
    white-space: break-spaces;
    font-family: Laien, serif;
    .special-text {
      color: var(--style-color);
      text-decoration: underline;
    }
  }
}

@media (max-width: 767px) {
  .select-page-con{
    width: 100%;
    margin-bottom: 0;
    .title{
      font-size: 28px;
    }
    .subtitle{ font-size: 16px }
    .content {
      position: relative;
      gap: 0;
      width: 100%;
      justify-content: center;

      > img{
        height: 392px;
        width: 100%;
        object-fit: contain;
        position: absolute;
        object-position: center center;
        left: -70px;
      }
      .select-con{
        position: relative;
        left: 110px;
        width: auto;
        .select {
          // font-size: 15px;
          /deep/ .select-item {
            padding-left: 16px;
            padding-right: 12px;
          }
        }
      }
    }
    .end-text{
      font-size: 12px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>