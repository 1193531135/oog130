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
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
<path d="M17.475 22.5252H6.52502L5.52502 7.05518H18.475L17.475 22.5252Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.525 1.4751H11.995V7.0551" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.085 13.0652H5.91504L6.52504 22.5252H17.475L18.085 13.0652Z" fill="white"/>
</svg>`
  if (refs.length) {
    refs.forEach((ref, index) => {
      const option = options[index].description
      const newDiv = document.createElement('div')
      newDiv.classList.add('select-insert')
      newDiv.innerHTML = `
          <div class="select-insert-title">${svg}<span>${option.title}</span></div>
          <div class="select-insert-subtitle">${option.subtitle}</div>
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
    <div class="btn-container" :style="'justify-content:' + 'right'">
      <div :class="'continue-btn ' + (isDisabled?'disabled':'')" @click="goIt">
        <div>{{ pageText.continue }}</div>
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
  .subtitle{
    margin-bottom: 30px;
  }
  /deep/ .select {
    margin-bottom: 15px;
    //预设11px padding
    .select-item {
      padding-top: 11px;
      padding-bottom: 13px;
    }
    .select-item.active + .select-insert{
      display: block;
    }
    .select-insert{
      text-align: left;
      padding: 20px 24px;
      background-color: #0156B7;
      display: none;
      .select-insert-title{
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .select-insert-subtitle{
        font-size: 15px;
      }
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