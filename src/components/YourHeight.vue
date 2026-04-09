<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref, computed, watch } from 'vue'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
const selectOptions = pageText.selectOptions
const unit = ref(pageData[route.name]?.unit || selectOptions[0])
const height = ref(pageData[route.name]?.height || '')
const height_cm = ref(pageData[route.name]?.height || '')
const checked = ref(pageData[route.name]?.checked || '')
const isDisabled = ref(!pageData[route.name])
function change(val) {
    pageData.set(route.name, {
        unit: unit.value,
        height: unit.value === 'ft/in' ? height.value.replace(/\D/g, '') : height_cm.value.replace(/\D/g, '')
    })
    push()
}


const isFocused = ref(false)
const isError = ref(false)
let placeholder_1 = ref("_ft")
let placeholder_2 = ref("__in")
const isErrorText = ref('Height must be greater than or equal to 90 cm')

// ft/in输入框
// 验证逻辑：实时检查
const validate = () => {
    let val = height.value.replace(/\D/g, '')

    isErrorText.value = "Height must be greater than or equal to 3 ft"
    console.log(val)
    if (val.length == 3 && (val - 0) % 100 >= 3) {
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
    console.log('onInput正在输入：', e.target.value.length, '-------', height.value.length)
    // 这里写你要的逻辑：限制数字、格式化、校验等
    let val = e.target.value.replace(/\D/g, '') // 去掉非数字
    let oldVal = height.value.replace(/\D/g, '')
    console.log('onInput去掉非数字：', '新：：' + val, '旧：' + oldVal)
    if (e.target.value.length < height.value.length) {
        console.log('onInput用户按下了删除键')
        //删除
        if (oldVal.length == 3) {
            height.value = val[0] + ' ft ' + val[1]
            console.log(height.value)
            placeholder_2.value = '_in'
            e.target.value = height.value
        } else if (oldVal.length == 2) {
            height.value = val[0] + ' ft'
            placeholder_2.value = '__in'
            e.target.value = height.value

        } else if (oldVal.length == 1) {
            placeholder_1.value = '_ft'
            placeholder_2.value = '__in'
            height.value = ''
            e.target.value = height.value
        }
    } else {
        console.log('onInput用户正在输入', height.value, val)
        //输入
        if (val.length == 1) {
            console.log('输入1')
            height.value = val + ' ft'
            placeholder_1.value = ''
            e.target.value = height.value
        } else if (val.length == 2) {
            console.log('输入2')
            height.value = val[0] + ' ft ' + val[1]
            placeholder_1.value = ''
            placeholder_2.value = "_in"
            e.target.value = height.value
        } else if (val.length == 3) {
            console.log('输入3')
            height.value = val[0] + ' ft ' + val[1] + val[2] + ' in'
            placeholder_1.value = ''
            placeholder_2.value = ''
            e.target.value = height.value
        }
    }
    // 实时验证
    validate()
}
// cm输入框
// 验证逻辑：实时检查
const validate1 = () => {
    isErrorText.value = "Height must be greater than or equal to 90 cm"
    if (height_cm.value < 90 || height_cm.value === '') {
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
    height_cm.value = val
    // 实时验证
    validate1()
}

// 单位切换时重置所有状态
watch(unit, () => {
    isError.value = false
    isDisabled.value = true
    isFocused.value = false
    height.value = ''
    height_cm.value = ''
    placeholder_1.value = "_ft"
    placeholder_2.value = "__in"
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
                <div class="buttons-icon" @click="unit = selectOptions[0]" :class="{ 'icon_active': unit === 'ft/in' }">
                    ft
                </div>
                <div class="buttons-icon" @click="unit = selectOptions[1]" :class="{ 'icon_active': unit === 'cm' }">cm
                </div>
                <div class="buttons-bg" :class="{ 'bg_active': unit === 'cm' }"></div>
            </div>
        </div>
        <div class="inputLable">{{ pageText.inputLable + ' (' + unit + ')' }}</div>

        <!-- 输入框容器 -->
        <!-- ft/in -->
        <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }" v-if="unit === 'ft/in'">
            <input ref="inputRef" @keydown.delete="onDelete" @input="onInput" class="input" placeholder=""
                @focus="isFocused = true" />
            <div class="input-text">
                <span>{{ height }}</span>
                <span class="placeholder">{{ placeholder_1 }}</span>
                <span class="placeholder">{{ placeholder_2 }}</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>


        <!-- cm -->
        <div @click="focusInput" v-if="unit === 'cm'" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input ref="inputRef" v-model="height_cm" @input="onInput1" class="input" placeholder="__"
                @focus="isFocused = true" />
            <div class="input-text">
                <span class="unit">{{ height_cm }}</span>
                <span>cm</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        <div class="texBox">
            <div class="texBox-top">
                <span class="icon">☝️</span>
                <span class="checkboxLabel">{{ pageText.checkboxLabel }}</span>
            </div>
            <div class="texBox-top">
                <span class="icon" style="opacity: 0;">☝️</span>
                <span class="text">{{ pageText.text }}</span>
            </div>
        </div>
        <div class="btn-container">
            <div class="continue-btn" :class="{ 'disabled': isDisabled }" @click="change">
                <div class="spacer"></div>
                <div>{{ pageText.continue }}</div>
                <img src="@/assets/continue-icon.png">
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.text-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 428px;
    box-sizing: border-box;

    .title {
        margin-top: 69px;
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
        margin-top: 66px;
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
            color: #fff;
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
            }

            .placeholder {
                color: #515151;
            }
        }

        /* 输入有内容时，文字透明 */
        .input:not(:placeholder-shown) {
            color: transparent;
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

    .texBox {
        margin-top: 24px;
        width: 100%;
        box-sizing: border-box;
        padding: 16px;
        border-radius: 8px;
        background: #EDF0F3;

        .icon {
            font-size: 32px;
            margin-right: 8px;
        }

        .texBox-top {
            display: flex;
            width: 100%;
            align-items: center;

            .checkboxLabel {
                color: #242424;
                font-size: 16px;
                font-weight: 500;
            }

            .text {
                color: #959799;
                font-weight: 400;
                font-size: 13px;
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