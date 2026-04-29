<script setup>
import {ref, useSlots, onMounted, computed} from "vue";
import {PageData} from "@/tool/index.js";
import Select from "@/components/module/select.vue";
import {useRoute} from "vue-router";
import { PushControl } from "@/tool/index.js";
const pushControl = new PushControl()
const pageData = new PageData()
const route = useRoute()

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
  imgUrl: String,
  handleNextStep: Function,
  // 图片的偏移量
  imageOffset: Array
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
  props.handleNextStep ? props.handleNextStep(selectData.value) : pushControl.push()
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
            <img src="@/assets/continue-icon.webp">
          </div>
        </div>
      </div>
      <div class="content-image">
        <img :src="imgUrl" :style="imageOffset ?`--transform:${imageOffset[0]},${imageOffset[1]}`:''">
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
    max-width: 488px;
    // font-family: , serif;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .content-con{
    display: flex;
    align-items: flex-start;
    gap: 32px;
    .select-con{
      max-width: 376px;
      max-height: 504px;
    }
    .content-image{
      width: 376px;
      height: 504px;
    }
    .select-con{
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
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
    padding: 0 16px 100px;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
    width: 100%;
    .title {
      font-size: 28px;
      margin-bottom: 64px;
    }
    .content-con{
      width: 100%;
      gap: 0;
      //为了让图片展示完全，用margin撑高
      margin-bottom: 24px;
      .select-con,.content-image{
        max-width: none;
        height: auto;
      }
      .select-con{
        position: relative;
        z-index: 1;
        width: 256px;
      }
      .content-image{
        flex: 1;
        min-width: 0;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        --transform:0,0;
        img{
          transform: translate(var(--transform));
          position: absolute;
          //height: 398px;
          width: 297px;
        }
      }
    }
  }
}
</style>