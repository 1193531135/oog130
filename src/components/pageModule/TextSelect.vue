<script setup>
import { ref ,useSlots,onMounted } from "vue";
import { PageData } from "@/tool/index.js";
import Select from "@/components/module/select.vue";
import { useRoute } from "vue-router";

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
  }
})

const emit = defineEmits(['update:modelValue','change','click'])
const selectData = ref(props.multiple?[]:null)


// change事件
function change(val){
  // 存储数据
  const pageData = new PageData()
  pageData.set(route.name,val)
  emit('update:modelValue', val)
  // 触发外部change事件
  emit('change', val)
}

</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
      <Select class="select" v-model="selectData" :multiple="multiple" :options="options" @change="change"></Select>
      <div class="btn-container" :style="'justify-content:' + btnAlign">
        <div class="continue-btn" @click="emit('click')">
          <div>{{ btnText }}</div>
          <img src="@/assets/select-item-icon.png">
        </div>
      </div>
  </div>
</template>

<style scoped lang="less">
.select-page-con{
  padding: 0 33px;
  max-width: 498px;
  box-sizing: border-box;
  text-align: center;
  .title {
    font-family: Laien,serif;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  /deep/ .select{
    margin-bottom: 32px;
    //预设11px padding
    .select-item{
      padding-top: 11px;
      padding-bottom: 13px;
    }
  }
}
@media (max-width: 768px) {
  .select-page-con{
    padding: 0 24px;
    .title{ font-size: 28px }
  }
}
</style>