<script setup>
import { ref ,useSlots,onMounted } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()

import TextSelect from "@/components/pageModule/TextSelect.vue";
const pageText = window.languageData[route.name]

const selectData = ref(null)

const options = pageText.selectOptions.map((i,index) => {
  return {
    label: i,
    value: index,
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
      :multiple="false"
      :btn-text="pageText.continue"
      @change="change"
  ></TextSelect>
</template>

<style scoped lang="less">

</style>