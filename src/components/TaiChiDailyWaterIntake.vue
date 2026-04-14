<script setup>
import {ref, useSlots, onMounted, computed} from "vue";
import {PageData} from "@/tool/index.js";
import Select from "@/components/module/select.vue";
import {useRoute} from "vue-router";
import {push} from "@/tool/index.js";

const pageData = new PageData()
const route = useRoute()
const selectItemRefs = ref([])

const pageText = window.languageData[route.name]

const options = pageText.selectOptions.map((i, index) => ({
  label: i.label,
  value: index,
  description:i.description
}))

const selectData = ref(pageData[route.name] || null)

const isDisabled = computed(() => selectData.value === null)

function updateRefs(refs) {
  selectItemRefs.value = refs
  // refs获取后插入dom
  const iconUrl = new URL('@/assets/glass.webp', import.meta.url).href
  const icon = `<img src="${iconUrl}">`
  if (refs.length) {
    refs.forEach((ref, index) => {
      const option = options[index].description
      const newDiv = document.createElement('div')
      newDiv.classList.add('select-insert')
      newDiv.innerHTML = `
          ${icon}
          <div>
            <div class="select-insert-title">${option.title}</div>
            <div class="select-insert-subtitle">${option.subtitle}</div>
            ${option.endText ?`<div class="select-insert-endText">${option.endText}</div>`:''}
          </div>
      `
      ref.insertAdjacentElement('afterend', newDiv)
    })
  }
}

// change事件
function change(val) {
  // 存储数据
  pageData.set(route.name, val)
}

function goIt() {
  push()
}
</script>

<template>
  <div class="select-page-con">
    <div class="title">{{ pageText.title }}</div>
    <Select
        @updateRefs="updateRefs"
        class="select"
        v-model="selectData"
        :options="options"
        @change="change">
    </Select>
    <div class="subtitle">{{ pageText.subtitle }}</div>
    <div class="btn-container">
      <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
        <div class="spacer"></div>
        <div>{{ pageText.continue }}</div>
        <img src="@/assets/continue-icon.webp">
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.select-page-con {
  box-sizing: border-box;
  text-align: center;
  padding:0 20px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 570px;
  .title {
    font-family: Laien, serif;
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 24px;
    height: 112px;
  }
  .subtitle{
    margin-bottom: 30px;
  }
  :deep(.select) {
    margin-bottom: 15px;
    gap: 0;
    //预设11px padding
    .select-item {
      margin-top: 16px;
    }
    .select-item.active + .select-insert{
      display: flex;
    }
    .select-insert{
      margin-top: 8px;
      text-align: left;
      padding: 16px;
      background-color: #FDFDF3;
      display: none;
      align-items: center;
      gap: 12px;
      img{
        width: 24px;
        height: 24px;
      }
      .select-insert-title{
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .select-insert-subtitle{
        font-size: 13px;
        font-weight: 400;
        color: #959799;
      }
      .select-insert-endText{
        margin-top: 12px;
        font-size: 13px;
        font-weight: 400;
        color: #BDC0C3;
      }
    }
  }
  .btn-container {
    position: fixed;
    height: 100px;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 16px 16px 12px;
  }
}

@media (max-width: 768px) {
  .select-page-con {
    padding: 0 16px 100px;
    width: auto;
    .title {
      font-size: 28px
    }
  }
}
</style>