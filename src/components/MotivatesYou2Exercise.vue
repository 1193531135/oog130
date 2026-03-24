<script setup>
import { ref ,useSlots,onMounted } from "vue";
import TextSelect from "@/components/pageModule/TextSelect.vue";
const pageText = window.languageData.MotivatesYou2Exercise

const selectData = ref([])

const options = pageText.selectOptions.map((i,index) => {
  return {
    label: i,
    value: index,
    mutex: index === pageText.selectOptions.length - 1
  }
})
function change(val){
  console.log(val)
}
</script>

<template>
  <TextSelect
      class="page-con"
      :title="pageText.title"
      :options="options"
      v-model="selectData"
      :multiple="true"
      @change="change"
  ></TextSelect>
</template>

<style scoped lang="less">

</style>