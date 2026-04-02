<script setup>
import { computed, ref } from "vue"
import { useRoute } from "vue-router"
import { PageData, push } from "@/tool/index.js"

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(Array.isArray(pageData[route.name]) ? pageData[route.name] : [])
const modelImage = new URL("@/assets/image/selectAreas-bg.png", import.meta.url).href

const isDisabled = computed(() => !selectValue.value.length)

const areas = computed(() => {
  const styleList = [
    {left:"-7.15em",top:0},
    {right:"-12.5em",top:"3.5em"},
    {right:"-12.5em",top:"19.4em"},
    {right:"-6.4em",top:"32.7em"},
    {left:"-6.95em",top:"25.8em"},
    {left:"-12.95em",top:"12em"},
  ]
  return  pageText.selectOptions.map((i, index) => ({
    label: i,
    value: index,
    full: index === 0,
    style: styleList[index],
  }))
})

const fullIndex = computed(() => areas.value.find(item => item.full)?.value)

function isActive(index) {
  return selectValue.value.includes(index)
}

function toggle(index) {
  let updateVal = index
  if (selectValue.value.includes(index)) {
    // 已经选中则取消选中,如果是全选则取消所有选中
    updateVal = fullIndex.value === index ? [] : selectValue.value.filter(item => item !== index)
  } else {
    // 没有选中则添加选中,如果是全选则选中所有
    updateVal = fullIndex.value === index ? areas.value.map(i => i.value) : [...selectValue.value, index]
  }
  selectValue.value = updateVal
  pageData.set(route.name, updateVal)
}

function goIt() {
  if (isDisabled.value) {
    return
  }
  push()
}
</script>

<template>
  <div class="select-areas-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="subtitle">{{ pageText.subtitle }}</div>

    <div class="stage">
      <img :src="modelImage" class="model-image" alt="Body target areas" />

      <button
        v-for="item in areas"
        type="button"
        :style="item.style"
        :class="[
          'area-item',
          isActive(item.value) ? 'active' : ''
        ]"
        @click="toggle(item.value)"
      >
        <span class="area-item-label">{{ item.label }}</span>
        <div :class="['checkbox-custom','indicator',isActive(item.value) ? 'active' : '']"></div>
      </button>
    </div>
    <div class="btn-container">
      <div :class="`continue-btn ${isDisabled ? 'disabled' : ''}`" @click="goIt">
        <div>{{ pageText.continue || "Continue" }}</div>
        <img src="@/assets/select-item-icon.png" alt="Continue" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.select-areas-page {
  width: 668px;
  padding: 0 24px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 40px;
    font-family: Laien, serif;
    font-weight: 700;
    width: 100%;
    text-align: center;
    margin-bottom: 4px;
  }
  .subtitle {
    font-size: 20px;
    color: #aaa;
    text-align: center;
    margin-bottom: 18px;
  }
  .stage {
    position: relative;
    font-size: 10px;
    .model-image {
      width: 30.5em;
      height: 47.7em;
      object-fit: cover;
      display: block;
    }
    .area-item {
      font-size: inherit;
      position: absolute;
      width: 135px;
      height: 55px;
      border-radius: 8px;
      border: 2px solid transparent;
      background: #3a3a3a;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.4em;
      cursor: pointer;
      font-family: Laien, sans-serif;
      font-weight: 500;
      box-sizing: border-box;
      .area-item-label{ font-size: 16px }
      .indicator {
        font-size: 23px;
        border-radius: 50%;
        --border-width: 3px;
        --aspect-ratio: 1.57;
        --gou-color:var(--style-color);
      }
      &.active{
        background-color: var(--style-color);
        .indicator.active {
          border-color: #fff;
          background-color: white;
        }
      }
    }
  }
}

.btn-container {
  justify-content: flex-end;
  margin-top: 18px;
}

@media (max-width: 430px) {
  .select-areas-page{
    .stage{
      transform: scale(0.65);
    }
  }
}
</style>
