<script setup>
import {ref, useSlots, onMounted, computed} from "vue";
import {PageData} from "@/tool/index.js";
import Select from "@/components/module/select.vue";
import {useRoute} from "vue-router";
import { push } from "@/tool/index.js";

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]

const title = pageText.title
const subtitle = pageText.subtitle
const options = pageText.selectOptions.map((i, index) => ({label: i, value: index}))
// 男女
const imgUrl = pageData["ChooserGender"] ? new URL("@/assets/image/taiChiExperienceCheck-1.png", import.meta.url): new URL("@/assets/image/taiChiExperienceCheck-0.png", import.meta.url)

const props = defineProps({
  modelValue: null,
  // 多选
  multiple: Boolean,
  btnText: {
    type: String,
    default: 'Continue'
  },
  imgUrl: String,
  handleNextStep: Function
})

const emit = defineEmits(['update:modelValue', 'change', 'click'])
const selectData = ref(pageData[route.name] || (props.multiple ? [] : null))

const isDisabled = computed(() => props.multiple ? !selectData.value.length : selectData.value === null)
// const bgImage = new URL(props.imgUrl, import.meta.url)

// change事件
function change(val) {
  // 存储数据
  pageData.set(route.name, val)
  emit('update:modelValue', val)
  // 触发外部change事件
  emit('change', val)
}

function goIt() {
  props.handleNextStep ? props.handleNextStep(selectData.value) : push()
}
</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
    <div class="content-con">
      <div class="select-con">
        <Select class="select" v-model="selectData" :multiple="multiple" :options="options" @change="change"></Select>
        <div class="btn-container">
          <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
            <div class="spacer"></div>
            <div>{{ btnText }}</div>
            <img src="@/assets/continue-icon.png">
          </div>
        </div>
      </div>
      <div class="content-image">
        <img :src="imgUrl">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.select-page-con {
  box-sizing: border-box;
  text-align: center;
  padding:0 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    max-width: 1110px;
    font-family: Laien, serif;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .content-con{
    display: flex;
    align-items: end;
    gap: 32px;
    .select-con,.content-image{
      max-width: 376px;
    }
    .select-con{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    /deep/ .select {
      margin-bottom: 96px;
    }
    .content-image{
      img{
        object-fit: contain;
        width: 100%;
      }
    }
  }
}

@media (max-width: 767px) {
  .select-page-con {
    overflow: hidden;
    padding: 0 16px;
    .title {
      font-size: 28px;
      margin-bottom: 0;
      height: 106px;
    }
    .content-con{
      width: 100%;
      gap: 0;
      position: relative;
      .select-con,.content-image{
        max-width: none;
        height: auto;
      }
      .select-con{
        position: absolute;
        z-index: 1;
        right: 0;
        bottom: 0;
        width: 144px;
        /deep/ .select {
          margin-bottom: 0;
        }
      }
      .content-image{
        position: relative;
        left: -16px;
        width: 100%;
        height: 338px;
        img{
          height: 100%;
          object-fit: contain;
          object-position: left;
        }
      }
    }
  }
}
</style>
