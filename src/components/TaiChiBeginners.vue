<script setup>
import {ref} from 'vue'
import Select from './module/select.vue'
import { push } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(pageData[route.name])

const options = pageText.selectOptions.map((i, index) => ({label: i, value: index}))

function change(val){
  // 存储数据
  pageData.set(route.name,val)
  //
  push()
}
</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle">{{ pageText.subtitle }}</div>
    <div class="content">
      <img src="../assets/start.png">
      <div class="select-con">
        <Select v-model="selectValue" :options="options" class="select" @change="change">
          <template #default="{ itemData }">
            <div>{{ itemData.label }}</div>
            <img src="../assets/select-item-icon.png">
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
  .title {
    margin-top: 69px;
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
      .selec-title{
        font-size: 22px;
        color: var(--style-color);
        margin-bottom: 16px;
        font-weight: 600;
      }
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

@media (max-width: 768px) {
  .title{
    font-size: 28px;
    max-width: 398px;
  }
  .subtitle{ font-size: 16px }
  .content {
    position: relative;
    > img{ width: 184px;height: 276px }
    .select-con{
      width: 178px;
      .selec-title{
        font-size: 18px
      }
      .select {
        font-size: 15px;
        /deep/ .select-item {
          height: 54px;
        }
      }
    }
    .end-text{
      font-size: 12px;
      position: absolute;
      width: 100%;
      bottom: -44px;
      left: 0;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>