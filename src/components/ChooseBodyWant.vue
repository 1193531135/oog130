<script setup>
import {ref} from 'vue'
import Select from './module/select.vue'
import { push } from '@/tool/index.js'
import {PageData} from "@/tool/index.js";
import {useRoute} from 'vue-router'

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(pageData[route.name])

const options = pageText.selectOptions.map((i, index) => ({
  label: i,
  value: index,
  imgUrl: new URL("@/assets/image/choose-body-0.webp", import.meta.url)
}))

function change(val) {
  // 存储数据
  pageData.set(route.name, val)
  //
  push()
}
</script>

<template>
  <div class="page-con">
    <div class="title">{{ pageText.title }}</div>
    <Select v-model="selectValue" :options="options" class="select" @change="change">
      <template #default="{ itemData }">
        <img :src="itemData.imgUrl"/>
        <div>{{ itemData.label }}</div>
      </template>
    </Select>
  </div>
</template>

<style lang="less" scoped>
.page-con {
}

.title {
  font-size: 40px;
  font-family: Laien;
  font-weight: 700;
  text-align: center;
  margin-bottom: 34px;
}

.page-con {
  /deep/ .select-container{
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    .select-item {
      padding: 0;
      justify-content: space-between;
      flex-direction: column;
      gap: 0;
      width: calc(100vw * 270 / 1440);
      > div{
        height: 32px;
        width: 100%;
        text-align: center;
        background-color: #5E5E5E;
        line-height: 32px;
        font-family: Laien,serif;
      }
      > img {
        object-fit: contain;
        width: 100%;
      }
    }
    .select-item.active{
      > div{ background-color: var(--style-color) }
    }
  }
}

@media (max-width: 768px) {
  .page-con {
    width: auto;
    padding: 0 24px;
    /deep/ .select-container{
      flex-direction: row;
      flex-wrap: wrap;
      .select-item {
        width: calc(50% - 20px);
      }
    }
  }
  .title {
    font-size: 30px;
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>