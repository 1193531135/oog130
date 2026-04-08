<script setup>
import { ref ,useSlots,onMounted } from "vue";
const props = defineProps({
  options: Array,
  modelValue: null,
  // 多选
  multiple: Boolean,
})

const isSlot = useSlots()
const emit = defineEmits(['update:modelValue','change','updateRefs'])
const itemRefs = ref([])
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
  else {
    //单选
    if(props.modelValue === val) {
      // 已经选中则取消选中
      updateVal = null
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
  mutexVal.value = props.options.filter(item => item.mutex)[0]?.value;
  emit('updateRefs', itemRefs.value)
})
</script>

<template>
  <div class="select-container">
    <div :class="'select-item' + (isActive(item.value) ? ' active' : '')"
         :style="mutexVal && item.value === mutexVal ? 'margin-top: 20px' : ''"
         v-for="(item, index) in options"
         :key="index"
         @click="change(item.value,item.mutex)"
         ref="itemRefs"
    >
      <!--  自定义预留插槽    -->
      <template v-if="isSlot.default">
        <slot :itemData="item"/>
      </template>
      <!--   圆形选中按钮样式   -->
      <template v-else>
        <div>
          <div class="select-label">{{ item.label }}</div>
          <div v-if="item.subLabel" class="select-subLabel">{{ item.subLabel }}</div>
        </div>
        <div class="select-item-sign-text" v-if="item.mutex"> ❌</div>
        <div :class="['select-item-sign','checkbox-custom',(isActive(item.value) ? ' active' : '')]" v-else></div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
/* 公共的选择器样式 */
.select-container{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 18px;
  font-family: Poppins,serif;
  font-weight: 500;
  .select-item{
    background-color: #EDF0F3;
    gap: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 20px 24px;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
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
    .select-subLabel{
      font-size: 15px;
      color: #AAA;
    }
  }
  //.select-item:active:not(.active){
  //  opacity: 0.7;
  //}
  .select-item.active{
    background-color: var(--style-color);
    color: white;
    .select-item-sign{
      border-color: white;
      background-color: white;
      --gou-color: var(--style-color);
      --check-width: 0.24em;
    }
  }
}
@media (max-width: 768px) {
  .select-container{
    gap: 8px;
    .select-item{
      padding: 20px 12px 20px 16px;
    }
  }
}
</style>