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
    default: 'right'
  },
  handleNextStep: Function
})

const emit = defineEmits(['update:modelValue', 'change', 'click','updateRefs'])
const selectData = ref(pageData[route.name] || (props.multiple ? [] : null))

const isDisabled = computed(() => props.multiple ? !selectData.value.length : selectData.value === null)

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
    <Select @updateRefs="(refs) => $emit('updateRefs', refs)" class="select" v-model="selectData" :multiple="multiple" :options="options" @change="change"></Select>
    <div class="btn-container" :style="'justify-content:' + btnAlign">
      <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
        <div>{{ btnText }}</div>
        <img src="@/assets/select-item-icon.png">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.select-page-con {
  padding: 0 33px 20px;
  max-width: 498px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-family: Laien, serif;
    font-size: 40px;
    font-weight: 700;
    width: 100%;
    margin-bottom: 24px;
  }

  /deep/ .select {
    margin-bottom: 32px;
    //预设11px padding
    .select-item {
      padding-top: 11px;
      padding-bottom: 13px;
    }
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 24px;

    .title {
      font-size: 28px
    }
  }
}
</style>