<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref, computed, watch } from 'vue'


const isDisabled = ref(true) // 按钮禁用状态，初始为true
const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
console.log('pageText', pageText)
const selectOptions = pageText.selectConfig.selectOptions
const unit = ref(selectOptions[0])
function change(val) {
    pageData.set(route.name, {
        unit: unit.value,
        weight: unit.value === 'lb' ? CurrentWeight_lb.value.replace(/\D/g, '') : CurrentWeight_kg.value.replace(/\D/g, '')

    })
    push()
}


const CurrentWeight_lb = ref('')
const CurrentWeight_kg = ref('')
const isFocused = ref(false)
const isError = ref(false)
//提示文本
const isErrorText = ref('Weight must be greater than or equal to 77 lb')

// ft/in输入框
// 验证逻辑：失焦时检查是否为空
const validate = () => {
    let val = CurrentWeight_lb.value.replace(/\D/g, '') - 0

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
    console.log('onInput正在输入：', e.target.value.length, '-------', CurrentWeight_lb.value.length)
    // 这里写你要的逻辑：限制数字、格式化、校验等
    let val = e.target.value.replace(/\D/g, '') // 去掉非数字
    if (val.length > 3) val = val.slice(0, 3)   // 最多3位
    CurrentWeight_lb.value = val
    validate()
}
// cm输入框
// 验证逻辑：失焦时检查是否为空
const validate1 = () => {
    isErrorText.value = "Weight must be greater than or equal to 35 kg"
    if (CurrentWeight_kg.value < 35 || CurrentWeight_kg.value === '') {
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
    CurrentWeight_kg.value = val
    validate1()
}
// 单位切换时重置所有状态
watch(unit, () => {
    isError.value = false
    isDisabled.value = true
    isFocused.value = false
    CurrentWeight_lb.value = ''
    CurrentWeight_kg.value = ''
})
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
            <span class="description">{{ pageText.selectConfig.title }}</span>
            <div class="buttons">
                <button :class="{ active: unit === selectOptions[0] }" @click="unit = selectOptions[0]">
                    {{ selectOptions[0] }}
                </button>
                <button :class="{ active: unit === selectOptions[1] }" @click="unit = selectOptions[1]">
                    {{ selectOptions[1] }}
                </button>
            </div>
        </div>
        <div class="inputLable">{{ pageText.inputLable + ' (' + unit + ')' }}</div>

        <!-- 输入框容器 -->
        <!-- lb -->
        <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }" v-if="unit === 'lb'">
            <input ref="inputRef" v-model="CurrentWeight_lb" @input="onInput" class="input" placeholder="__" @focus="isFocused = true"
                @blur="validate" />
            <div class="input-text">
                <span class="unit">{{ CurrentWeight_lb }}</span>
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
            <input ref="inputRef" v-model="CurrentWeight_kg" @input="onInput1" class="input" placeholder="__" @focus="isFocused = true"
                @blur="validate1" />
            <div class="input-text">
                <span class="unit">{{ CurrentWeight_kg }}</span>
                <span>cm</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        <!-- 当输入的时候 class:grenn -->
        <div class="textBox">
            <p class="textBox-title">{{ pageText.textBox.title }}</p>
            <p class="textBox-content ">{{ pageText.textBox.text }}</p>
        </div>
        <div v-if="ishow" class="textBox bmi">
            <p class="textBox-title">Your BMI is 21, considered Normal</p>
            <p class="textBox-content ">We'll use this information to customize your plan to your needs.</p>

        </div>
        <div class="btn">
            <div class="btn-container">
                <div class="continue-btn" :class="{ 'disabled': isDisabled }" @click="change">
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
            display: flex;
            gap: 8px;
            height: 100%;

            button {
                padding: 0 24px;
                border: none;
                background: #3A3A3A;
                color: #fff;
                cursor: pointer;
                border-radius: 4px;
                box-sizing: border-box;
                border: 2px solid #3A3A3A;

            }

            button.active {
                border: 2px solid #57810D;
            }
        }




    }

    .inputLable {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #fff;
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
        background-color: #3A3A3A;
        border: 1px solid #515151;
        transition: border-color 0.2s;
        margin-top: 29px;

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
            color: #fff;
            /* 默认白色 */
            caret-color: #fff;
            /* 光标白色 */
        }

        .input-text {
            position: absolute;
            font-size: 20px;
            color: #fff;

            .unit {
                display: inline-block;
                min-width: 35px;
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
        border-color: #57810D;
        box-shadow: 0 0 0 1px #57810D;
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

    .textBox {
        width: 100%;
        height: auto;
        padding: 20px 24px;
        box-sizing: border-box;
        border: 1px solid #515151;
        background: #3A3A3A;
        margin-top: 24px;


        .textBox-title {
            width: 100%;
            color: #fff;
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
        }

        .textBox-content {
            width: 100%;
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
            color: #969696;
        }
    }

    .btn {
        margin-left: 260px;
        margin-top: 112px;
    }



}

@media (max-width: 600px) {
    .text-page {
        width: 100vw;
        padding: 0 20px;
        box-sizing: border-box;

        .lable {
            width: 80vw;
        }
    }
}
</style>