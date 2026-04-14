<script setup>
import {computed, ref} from 'vue'
import Select from './module/select.vue'
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

const isDisabled = computed(() => props.multiple ? !selectValue.value.length : selectValue.value === null)

function goIt() {
  props.handleNextStep ? props.handleNextStep(selectData.value) : push()
}

function change(val) {
  // 存储数据
  pageData.set(route.name, val)
  //
}
</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ title }}</div>
    <Select v-model="selectValue" :options="options" class="select" @change="change">
      <template #default="{ itemData }">
        <div class="left-content">
          <div :class="['select-item-sign','checkbox-custom']"></div>
          <div>{{ itemData.label }}</div>
        </div>
        <img :src="itemData.imgUrl"/>
      </template>
    </Select>
    <div class="btn-container">
      <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
        <div class="spacer"></div>
        <div>{{ btnText }}</div>
        <img src="@/assets/continue-icon.webp">
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.select-page-con {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0 10%;
  .title {
    font-size: 40px;
    font-family: Laien,serif;
    font-weight: 700;
    text-align: center;
    height: 156px;
  }
  :deep(.select){
    flex-direction: row;
    flex-wrap: wrap;
    align-self: stretch;
    justify-content: space-between;
    .select-item {
      width: calc(50% - 32px);
      padding: 0 0 0 24px;
      justify-content: space-between;
      .left-content{
        display: flex;
        gap: 11px;
        .select-item-sign{
          font-size: 26px;
          border-radius: 50%;
          border: 2.5px solid #C7C9CC;
          --aspect-ratio: 10/6;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      }
      img {
        width: 172px;
        height: 151px;
        object-position: center;
        object-fit: contain;
      }
    }
    .select-item.active{
      .select-item-sign{
        border-color: white;
        background-color: white;
        --gou-color: var(--style-color);
        --check-width: 0.24em;
      }
    }
  }
  .btn-container {
    position: fixed;
    height: 100px;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 16px 16px 12px;
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 16px 100px;
    .title {
      height: 106px;
      font-size: 28px;
    }
    :deep(.select){
      flex-direction: column;
      .select-item {
        padding: 0 0 0 16px;
        width: auto;
        img {
          height: 110px;
          width: auto;
          object-position: center;
          object-fit: contain;
        }
      }
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>