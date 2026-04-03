<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref, computed, watch } from 'vue'
import Select from './module/select.vue'

const selectValue = ref(null)
const isDisabled = ref(true)
const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
const options = pageText.selectOptions.map((i, index) => ({ label: i.label, value: index, subLabel: i.subLabel }))

function change(val) {
    console.log(val)
    pageData.set(route.name, val)
}
watch(selectValue, (newVal) => {
    isDisabled.value = newVal === null
})
// BMI 值
const bmiValue = ref(18.5)

// 区间标准
const BMI_MAX = 40
const UNDERWEIGHT_MAX = 18.5
const NORMAL_MAX = 23.9
const OVERWEIGHT_MAX = 27.9

// 状态计算
const bmiStatus = computed(() => {
    const val = bmiValue.value
    if (val < UNDERWEIGHT_MAX) return 'Under Weight'
    if (val <= NORMAL_MAX) return 'Normal'
    if (val <= OVERWEIGHT_MAX) return 'Overweight'
    return 'Obese'
})

// 指针位置百分比
const pointerLeft = computed(() => {
    const percent = (bmiValue.value / BMI_MAX) * 100
    return Math.max(0, Math.min(100, percent))
})

const currentColor = computed(() => {
    const val = bmiValue.value
    if (val < UNDERWEIGHT_MAX) return '#40b4ff' // 偏瘦 - 蓝色
    if (val <= NORMAL_MAX) return '#5ed967'     // 正常 - 绿色
    if (val <= OVERWEIGHT_MAX) return '#f7d04a' // 超重 - 黄色
    return '#f54242'                            // 肥胖 - 红色
})
</script>

<template>
    <div class="text-page">
        <div class="title">{{ pageText.title }}</div>
        <div class="selectBox">
            <div class="selectOption">
                <Select v-model="selectValue" :options="options" class="select" @change="change">
                    <template #default="{ itemData }">
                        <div>
                            <div class="select-subLabel">{{ itemData.subLabel }}</div>
                            <div class="select-label">{{ itemData.label }}</div>
                        </div>
                    </template>
                </Select>
            </div>
            <img class="img" src="@/assets/PersonalSummary.png" alt="">
        </div>
        <div class="bmi-card">
            <!-- 标题 -->
            <h2 class="bmi-title">{{ pageText.textBox.title }}</h2>

            <!-- 数值与状态 -->
            <div class="bmi-value-row">
                <span class="bmi-number" :style="{ color: currentColor }">{{ bmiValue }}</span>
                <span class="bmi-status" :style="{ color: currentColor }">{{ bmiStatus }}</span>
            </div>

            <!-- 进度条 -->
            <div class="progress-container">
                <div class="progress-bar"></div>
                <div class="progress-pointer" :style="{ left: pointerLeft + '%' }"></div>
                <div class="progress-labels">
                    <span v-for="value in pageText.textBox.weightType">{{ value }}</span>
                </div>
            </div>

            <!-- 说明文本 -->
            <p class="bmi-desc">
                {{ pageText.textBox.text }}
            </p>
        </div>
        <div class="btn">
            <div class="btn-container">
                <div class="continue-btn" :class="{ 'disabled': isDisabled }" @click="push()">
                    <div>{{ pageText.continue }}</div>
                    <img src="@/assets/select-item-icon.png">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.text-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 100%;

    .selectBox {
        margin-top: 24px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        width: 100%;

        /deep/.selectOption {
            width: 287px;
            height: 336px;

            .select-item {
                width: 100%;
                height: 72px;
                box-sizing: border-box;
                padding: 0 20px;
                display: flex;

                .select-label {
                    color: #FFF;
                    font-size: 18px;
                    font-weight: 600;
                }

                .select-subLabel {
                    color: #aaa;
                    font-size: 14px;
                    font-weight: 500;
                }

            }

        }

        .img {
            width: 157px;
            height: 279px;
        }
    }

    .bmi-card {
        margin-top: 24px;
        width: 100%;
        height: auto;
        background-color: #2d2d2d;
        padding: 14px 16px;
        box-sizing: border-box;
        position: relative;


        .bmi-title {
            margin: 0 0 10px 0;
            font-size: 14px;
            font-weight: 500;
            color: #fff;
            font-family: Laien;
        }

        .bmi-value-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;


            .bmi-number {
                font-family: Laien;
                font-size: 32px;
                font-weight: 600;
                color: #46A2F3;
            }

            .bmi-status {
                font-family: Laien;
                font-size: 16px;
                font-weight: 600;
                color: #46A2F3;
            }

        }

        .progress-container {
            position: relative;
            margin-bottom: 12px;

            .progress-bar {
                width: 100%;
                height: 14px;
                border-radius: 12px;
                background: linear-gradient(90deg, #469FF8 0%, #4CE972 34.19%, #FFB137 54.42%, #FF4949 100%);
            }

            .progress-pointer {
                position: absolute;
                top: -10px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 12px solid #fff;
                transform: translateX(-50%);
                transition: left 0.3s ease;
            }
        }

        .progress-labels {
            font-family: Laien;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            margin-top: 6px;
            font-size: 12px;
            color: #fff;


        }

        .bmi-desc {
            font-family: Laien;
            font-weight: 400;
            font-size: 14px;
            color: #969696;
            line-height: 18px;
        }
    }

    .btn {
        margin-left: 262px;
        margin-top: 67px;
    }
}

@media (max-width: 600px) {
    .text-page {
        width: 100vw;
        padding: 0 20px;
        box-sizing: border-box;
    }

}
</style>