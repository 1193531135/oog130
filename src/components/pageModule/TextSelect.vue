<script setup>
import { ref ,useSlots,onMounted } from "vue";
import Select from "@/components/module/select.vue";

const props = defineProps({
  options: Array,
  modelValue: null,
  // 多选
  multiple: Boolean,
  title: String,
  subtitle: String,
  btnAlign: {
    type: String,
    default: 'right'
  }
})

const emit = defineEmits(['update:modelValue','change','click'])
const selectData = ref(props.multiple?[]:null)


// change事件
function change(val){
  emit('update:modelValue', val)
  // 触发外部change事件
  emit('change', val)
}

</script>

<template>
  <div class="page-con">
    <div class="title">{{ title }}</div>
    <div class="subtitle">{{ subtitle }}</div>
    <div class="select-box">
      <Select v-model="selectData" :multiple="multiple" :options="options" @change="change"></Select>
      <div class="btn-container" :style="'justify-content:' + btnAlign">
        <div class="continue-btn" @click="emit('click')">
          <div>Continue</div>
          <img src="@/assets/select-item-icon.png">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-con{
  width: 498px;
  text-align: center;
  .title {
    font-family: Laien,serif;
  }
}
.select-box{
  padding: 0 33px;
}
.btn-container { display: flex }

</style>