<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { PushControl } from '@/tool/index.js'
import { ref, computed, watch } from 'vue'
const pushControl = new PushControl()
const pageData = new PageData()

const route = useRoute()
const pageText = window.languageData[route.name]
const selectOptions = pageText.selectOptions
const developOptions = pageText.develop 
const loseOptions = pageText.lose
const isLose = ref(false)
const textBox = ref(developOptions[0])
const unit = ref(pageData[route.name]?.unit || selectOptions[0])

function change(val) {
    pageData.set(route.name, {
        unit: unit.value,
        value: unit.value === 'lb' ? targetWeight_lb.value.replace(/\D/g, '') : targetWeight_kg.value.replace(/\D/g, '')
    })
    pushControl.push()
}

const isDisabled = ref(!pageData[route.name])
const targetWeight_lb = ref(pageData[route.name]?.value || '')
const targetWeight_kg = ref(pageData[route.name]?.value || '')
const isFocused = ref(false)
const isError = ref(false)
//提示文本
const isErrorText = ref('Weight must be greater than or equal to 77 lb')


const weightComparison = () => {
    let CurrentWeight = pageData.CurrentWeight
    let oldWeight, newWeight
    if (CurrentWeight.unit === 'lb') {
        oldWeight = Number((CurrentWeight.value * 0.4535).toFixed(2))
    } else {
        oldWeight = Number(CurrentWeight.value)
    }
    if (unit === 'lb') {
        newWeight = Number((targetWeight_lb.value * 0.4535).toFixed(2))
    } else {
        newWeight = Number(targetWeight_kg.value)
    }

    isLose.value = newWeight < oldWeight ? true : false
    console.log(newWeight, oldWeight)

}
// ft/in输入框
// 验证逻辑：失焦时检查是否为空
const validate = () => {
    let val = targetWeight_lb.value.replace(/\D/g, '') - 0

    isErrorText.value = "Weight must be greater than or equal to 77 lb"
    console.log(val)
    if (val >= 77) {
        isFocused.value = true
        isError.value = false
        isDisabled.value = false

    } else {
        isFocused.value = false
        isError.value = true
        isDisabled.value = true
    }
}
const onInput = (e) => {
    console.log('onInput正在输入：', e.target.value.length, '-------', targetWeight_lb.value.length)
    // 这里写你要的逻辑：限制数字、格式化、校验等
    let val = e.target.value.replace(/\D/g, '') // 去掉非数字
    if (val.length > 3) val = val.slice(0, 3)   // 最多3位
    targetWeight_lb.value = val
    validate()
    weightComparison()
}
// cm输入框
// 验证逻辑：失焦时检查是否为空
const validate1 = () => {
    isErrorText.value = "Weight must be greater than or equal to 35 kg"
    if (targetWeight_kg.value < 35 || targetWeight_kg.value === '') {
        isFocused.value = false
        isError.value = true
        isDisabled.value = true
    } else {
        isFocused.value = true
        isError.value = false
        isDisabled.value = false
    }
}
const onInput1 = (e) => {
    console.log('正在输入：', e.target.value)
    // 这里写你要的逻辑：限制数字、格式化、校验等
    let val = e.target.value.replace(/\D/g, '') // 去掉非数字
    if (val.length > 3) val = val.slice(0, 3)   // 最多3位
    targetWeight_kg.value = val
    validate1()
    weightComparison()
}
// 单位切换时重置所有状态
watch(unit, () => {
    isError.value = false
    isDisabled.value = true
    isFocused.value = false
    targetWeight_lb.value = ''
    targetWeight_kg.value = ''
})
//  聚焦
const inputRef = ref(null)
const focusInput = () => {
    if (inputRef.value) {
        inputRef.value.focus()
    }
}

</script>

<template>
    <div class="text-page">
        <div class="title">{{ pageText.title }}</div>
        <div class="unit-switch">
            <div class="buttons">
                <div class="buttons-icon" @click="unit = selectOptions[0]" :class="{ 'icon_active': unit === 'lb' }">
                    {{ selectOptions[0] }}
                </div>
                <div class="buttons-icon" @click="unit = selectOptions[1]" :class="{ 'icon_active': unit === 'kg' }">
                    {{ selectOptions[1] }}
                </div>
                <div class="buttons-bg" :class="{ 'bg_active': unit === 'kg' }"></div>
            </div>
        </div>
        <div class="inputLable">{{ pageText.inputLable + ' (' + unit + ')' }}</div>

        <!-- 输入框容器 -->
        <!-- lb -->
        <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }" v-if="unit === 'lb'">
            <input ref="inputRef" v-model="targetWeight_lb" @input="onInput" class="input" placeholder="__"
                @focus="isFocused = true" @blur="validate" />
            <div class="input-text">
                <span class="unit">{{ targetWeight_lb }}</span>
                <span>lb</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>


        <!-- cm -->
        <div @click="focusInput" v-if="unit === 'kg'" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input ref="inputRef" v-model="targetWeight_kg" @input="onInput1" class="input" placeholder="__"
                @focus="isFocused = true" @blur="validate1" />
            <div class="input-text">
                <span class="unit">{{ targetWeight_kg }}</span>
                <span>kg</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        <!-- 当输入的时候 class:grenn -->
        <div class="texBox lose" v-if="isLose">
            <div class="texBox-top">
                <span class="icon">{{ textBox.title[0] }}</span>
                <span class="checkboxLabel">{{ textBox.title[1] + 12 + textBox.title[2] }}</span>
            </div>
            <div class="texBox-top">
                <span class="icon" style="opacity: 0;">☝️</span>
                <span class="text">{{ textBox.text }}</span>
            </div>
        </div>
        <div class="texBox develop" v-if="!isLose">
            <div class="texBox-top">
                <span class="icon">{{ textBox.title[0] }}</span>
                <span class="checkboxLabel">{{ textBox.title[1] + 12 + textBox.title[2] }}</span>
            </div>
            <div class="texBox-top">
                <span class="icon" style="opacity: 0;">☝️</span>
                <span class="text">{{ textBox.text }}</span>
            </div>
        </div>
        <div class="btn-container">
            <div class="continue-btn" :class="{ 'disabled': isDisabled }" @click="change">
                <div class="spacer"></div>
                <div>{{ pageText.continue }}</div>
                <img src="@/assets/continue-icon.webp">
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.text-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 513px;
    box-sizing: border-box;

    .title {
        
        text-align: center;
    }

    .unit-switch {
        margin-top: 50px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 56px;

        .buttons {
            width: 136px;
            height: 44px;
            box-sizing: border-box;
            border: 1.5px solid #2E73E0;
            border-radius: 41px;
            margin: 0 auto;
            padding: 4px;
            position: relative;

            .buttons-icon {
                float: left;
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 16px;
                color: #242424;
            }

            .buttons-bg {
                width: 50%;
                height: 100%;
                border-radius: 49px;
                background-color: #2E73E0;
                transition: margin-left 0.3s;
            }

            .icon_active {
                color: #fff;
            }

            .bg_active {
                margin-left: 50%;
            }
        }




    }

    .inputLable {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #242424;
        margin-top: 71px;
    }



    // 输入框样式
    .input-wrapper {
        width: 100%;
        box-sizing: border-box;
        margin: 0 6px;
        height: 64px;
        padding: 0px 11px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        background-color: #EDF0F3;
        border: 1.5px solid #E0E3E5;
        transition: border-color 0.2s;
        margin-top: 8px;

        .input {
            position: relative;
            z-index: 5;
            // flex: 1;
            background: transparent;
            border: none;
            outline: none;
            font-size: 20px;
            // width: 40px;
            /* 防止内容溢出 */
            color: #000;
            /* 默认白色 */
            caret-color: #000;
            /* 光标白色 */
        }

        .input-text {
            position: absolute;
            font-size: 20px;
            color: #000;

            .unit {
                display: inline-block;
                min-width: 35px;
                color: #000;
            }

            .placeholder {
                color: #515151;
            }
        }

        .input::placeholder {
            color: #515151;
        }



        .error-icon {
            width: 20px;
            height: 20px;
            background-color: #ff3b30;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
            margin-left: auto;
        }
    }

    /* 错误状态 */
    .input-wrapper.error {
        border-color: #ff3b30;
    }

    /* 聚焦状态 */
    .input-wrapper.focus {
        border-color: #2E73E0;
        box-shadow: 0 0 0 1px #2E73E0;
    }

    .error-text {
        color: #ff3b30;
        font-size: 12px;
        line-height: 16px;
        width: 100%;
        margin-top: 8px;
    }

    .bmi {
        background-color: #202919;
    }

    .texBox {
        margin-top: 24px;
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        border-radius: 8px;
        background: #EBF0F9;


        .texBox-top {
            display: flex;
            width: 100%;
            align-items: top;
            .icon {
                font-size: 26px;
                margin-right: 8px;
                line-height: 26px;
            }
            .checkboxLabel {
                color: #242424;
                font-size: 16px;
                font-weight: 500;
                line-height: 26px;
            }

            .text {
                color: #959799;
                font-weight: 400;
                font-size: 13px;
            }
        }
    }

    .develop {
        background-color: #FAEBEB;
    }

    .lose {
        background-color: #EBF0F9;
    }

    .btn-container {
        position: fixed;
        bottom: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        padding: 16px 16px 32px;
    }



}

@media (max-width: 600px) {
    .text-page {
        width: 100vw;
        padding: 0 16px;
        box-sizing: border-box;

        .lable {
            width: 80vw;
        }
        .input-wrapper {
            .input-text {
                font-size: 14px;
                .unit{
                    min-width: 25px;
                }
            }
            .input{
                font-size: 14px;
            }

        }
        .inputLable{
            margin-top: 32px;
            font-size: 16px;
        }
    }
}
</style>