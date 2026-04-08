<script setup>
import {ref} from 'vue'
import Select from "@/components/module/select.vue";
import { push } from '@/tool/index.js'
import {PageData} from "@/tool/index.js";
import {useRoute} from 'vue-router'

const route = useRoute()
const pageData = new PageData()

const selectValue = ref(pageData[route.name])

const props = defineProps({
  options: Array,
  modelValue: null,
  // 多选
  multiple: Boolean,
  title: String,
  subtitle: String,
  btnText: {
    type: String,
    default: 'Continue'
  },
  handleNextStep: Function
})

function change(val) {
  // 存储数据
  pageData.set(route.name, val)
  //
  push()
}
</script>

<template>
  <div class="page-con">
    <div class="title">{{ title }}</div>
    <Select v-model="selectValue" :options="options" class="select" @change="change">
      <template #default="{ itemData }">
        <div>{{ itemData.label }}</div>
        <img :src="itemData.imgUrl"/>
      </template>
    </Select>
  </div>
</template>

<style lang="less" scoped>
.page-con {
  max-width: 530px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
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
    padding: 0 0 0 24px;
    justify-content: space-between;

    img {
      width: 172px;
      height: 151px;
      object-position: center;
      object-fit: contain;
    }
  }
}

@media (max-width: 768px) {
  .page-con {
    padding: 0 16px;
    /deep/ .select-item {
      padding: 0 0 0 16px;
      img {
        width: 125px;
        height: 110px;
        object-position: center;
        object-fit: contain;
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