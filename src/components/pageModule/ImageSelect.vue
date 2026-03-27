<script setup>
import {ref, useSlots, onMounted, computed} from "vue";
import {PageData} from "@/tool/index.js";
import Select from "@/components/module/select.vue";
import {useRoute} from "vue-router";
import { push } from "@/tool/index.js";

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
  btnAlign: {
    type: String,
    default: 'left'
  },
  imgUrl: String,
  handleNextStep: Function
})

const emit = defineEmits(['update:modelValue', 'change', 'click'])
const selectData = ref(pageData.get()[route.name] || (props.multiple ? [] : null))

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
        <div class="btn-container" :style="'justify-content:' + btnAlign">
          <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
            <div>{{ btnText }}</div>
            <img src="@/assets/select-item-icon.png">
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
  max-width: 498px;
  box-sizing: border-box;
  text-align: center;
  padding-bottom: 20px;

  .title {
    font-family: Laien, serif;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .content-con{
    display: flex;
    align-items: flex-start;
    /deep/ .select {
      width: 328px;
      margin-bottom: 32px;
      //预设11px padding
      .select-item {
        padding-top: 11px;
        padding-bottom: 13px;
      }
    }
    .content-image{
      width: 280px;
      margin-left: -60px;
      img{
        object-fit: contain;
        width: 100%;
      }
    }
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 16px;
    .title {
      font-size: 28px
    }
    .content-con{
      .select-con{
        width: 100%;
        position: relative;
        z-index: 1;
      }
      /deep/ .select {
        width: calc(100% - 98px);
        margin-bottom: 32px;
        //预设11px padding
        .select-item {
          padding-top: 11px;
          padding-bottom: 13px;
        }
      }
      .content-image{
        width: 228px;
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>