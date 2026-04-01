<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]

const textList = ref(pageText.textList)

const currentIndex = ref(0)
const currentBg = computed(() => textList.value[currentIndex.value].bg)
const isLastItem = computed(() => currentIndex.value === textList.value.length - 1)
let timer = null

function autoNext() {
  currentIndex.value = (currentIndex.value + 1) % textList.value.length
}

onMounted(() => {
  timer = setInterval(autoNext, 2800)
})

onUnmounted(() => {
  clearInterval(timer)
})
function handleAnimationEnd() {
  if (isLastItem.value) {
    console.log('最后一条动画结束')
    clearInterval(timer)
    // 你要执行的代码写在这里
  }
}


</script>
<template>
  <div class="app">
    <!-- 动态背景 -->
    <Transition mode="out-in" name="bg-fade" @after-leave="handleAnimationEnd">
      <div 
        class="text-background"
        :key="currentIndex"
        :style="{ background: currentBg }"
        
      ></div>
    </Transition>

    <!-- 文案轮播 -->
    <Transition mode="out-in" name="text-fade" @after-leave="handleAnimationEnd">
      <h2 :key="currentIndex" class="text-wrapper">
        {{ textList[currentIndex].label }}
      </h2>
    </Transition>
  </div>
</template>



<style scoped>
.app {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  color: #fff;
  font-family: system-ui, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 背景：使用 Vue Transition 实现和文字完全同步 */
.text-background {
  position: absolute;
  width: 430px;
  height: 430px;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(50px);
  z-index: 1;
}

/* 背景淡入淡出动画（和文字同时间、同曲线） */
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: all 0.5s ease;
}
.bg-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.bg-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* 文字样式 */
.text-wrapper {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  max-width: 600px;
  z-index: 2;
  position: relative;
}

/* 文字淡入淡出动画 */
.text-fade-enter-active,
.text-fade-leave-active {
  transition: all 0.5s ease;
}
.text-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>