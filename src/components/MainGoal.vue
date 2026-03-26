<script setup>
import {ref} from 'vue'
import Select from './module/select.vue'
import {push} from '@/tool/index.js'
import {PageData} from "@/tool/index.js";
import {useRoute} from 'vue-router'

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(pageData.get()[route.name])

const options = pageText.selectOptions.map((i, index) => ({
  label: i,
  value: index,
  imgUrl: new URL("@/assets/image/mainGoal-select-item.png", import.meta.url)
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
        <div>{{ itemData.label }}</div>
        <img :src="itemData.imgUrl">
      </template>
    </Select>
  </div>
</template>

<style lang="less" scoped>
.page-con {
  width: 681px;
}

.title {
  font-size: 40px;
  font-family: Laien;
  font-weight: 700;
  text-align: center;
  margin-bottom: 34px;
}

.page-con {
  /deep/ .select-item {
    height: 141px;
    padding-right: 0;
    justify-content: space-between;

    img {
      width: 167px
    }
  }
}

@media (max-width: 768px) {
  .page-con {
    width: auto;
    padding: 0 24px;
  }
  .title {
    font-size: 30px;
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>