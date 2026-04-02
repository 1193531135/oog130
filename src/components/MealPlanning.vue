<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]


function change(val) {
    push()
}
// 进度值（可动态修改，0-100）
const progress = ref(25)

// 圆环半径（和viewBox对应，计算周长用）
const radius = 45
const circumference = 2 * Math.PI * radius

// 计算进度偏移量：周长 - 进度占比 * 周长
const dashOffset = computed(() => {
    return circumference - (progress.value / 100) * circumference
})

onMounted(() => {
    const timer = setInterval(() => {
        if (progress.value >= 100) {
            change()
            clearInterval(timer)
        } else {
            progress.value += 1
        }
    }, 70) // 每10毫秒增加1%，25%需要2500毫秒
})
</script>
<template>
    <div class="text-page">
        <div class="progress-container">
            <svg class="progress-ring" viewBox="0 0 100 100">
                <!-- 背景灰色圆环 -->
                <circle class="progress-ring__bg" cx="50" cy="50" r="45" fill="none" stroke="#444444"
                    stroke-width="8" />
                <!-- 绿色进度圆环 -->
                <circle class="progress-ring__bar" cx="50" cy="50" r="45" fill="none" stroke="#6a8a00" stroke-width="8"
                    stroke-linecap="butt" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
                    transform="rotate(-90 50 50)" />
            </svg>
            <!-- 中间百分比文字 -->
            <div class="progress-text">{{ progress }}%</div>
        </div>
        <span class="text">{{ pageText.text }}</span>
    </div>

</template>



<style scoped>
.text-page{
    width: 100vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.progress-container {
    position: relative;
    width: 149px;
    height: 149px;
    background-color: #222222;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.progress-ring {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.progress-ring__bar {
    /* 进度条动画过渡 */
    transition: stroke-dashoffset 0.5s ease-out;
}

.progress-text {
    font-size: 30px;
    font-weight: 700;
    font-family: Laient, sans-serif;
    color: #ffffff;
    z-index: 1;
    user-select: none;
}
.text{
    margin-top: 16px;
    font-size: 20px;
    font-weight: 500;
    font-family: Laient, sans-serif;
}
</style>