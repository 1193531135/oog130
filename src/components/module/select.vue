<script setup>
import { ref ,useSlots,onMounted } from "vue";
const props = defineProps({
  options: Array,
  modelValue: null,
  // 多选
  multiple: Boolean,
})

const isSlot = useSlots()
const emit = defineEmits(['update:modelValue','change'])
const mutexVal = ref(null)

// change事件
function change(val){
  let updateVal = val
  // 多选
  if(props.multiple) {
      if (props.modelValue.includes(val)) {
        // 已经选中则取消选中
        updateVal = props.modelValue.filter(item => item !== val)
      } else {
        // 有互斥的情况
        if(mutexVal.value){
          if(val === mutexVal.value){
            // 选择了互斥选项则取消其他选项的选中
            updateVal = [val]
          }else{
            // 选择了非互斥选项则取消互斥选项的选中
            updateVal = props.modelValue.filter(item => item !== mutexVal.value)
            updateVal.push(val)
          }
        }else {
          // 没有选中则添加选中
          updateVal = [...props.modelValue, val]
        }
      }

  }
  emit('update:modelValue', updateVal)

  // 触发外部change事件
  emit('change', updateVal)
}

// 判断是否选中
function isActive(val){
  if(props.multiple){
    return props.modelValue.includes(val)
  }else{
    return props.modelValue === val
  }
}

onMounted(() => {
  // 判断是否存在互斥选项
  mutexVal.value = props.options.filter(item => item.mutex)[0]?.value
})
</script>

<template>
  <div class="select-container">
    <div :class="'select-item' + (isActive(item.value) ? ' active' : '')"
         v-for="(item, index) in options"
         :key="index"
          @click="change(item.value,item.mutex)"
    >
      <!--  自定义预留插槽    -->
      <template v-if="isSlot.default">
        <slot :itemData="item"/>
      </template>
      <!--   圆形选中按钮样式   -->
      <template v-else>
        <div class="select-item-sign"></div>
        <div>{{ item.label }}</div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 公共的选择器样式 */
.select-container{
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 20px;
  font-family: Poppins,serif;
  font-weight: 500;
  .select-item{
    background-color: #3A3A3A;
    display: flex;
    align-items: center;
    padding: 0 26px;
    box-sizing: border-box;
    border: 2px solid rgba(0,0,0,0);
    cursor: pointer;
  }
  .select-item:active:not(.active){
    opacity: 0.7;
  }
  .select-item.active{
    border-color: var(--style-color);
  }
}
</style>