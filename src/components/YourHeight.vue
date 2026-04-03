<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref, computed, watch } from 'vue'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
const selectOptions = pageText.selectConfig.selectOptions
const unit = ref(pageData[route.name]?.unit || selectOptions[0])
const height = ref(pageData[route.name]?.height || '')
const height_cm = ref(pageData[route.name]?.height || '')
const checked = ref(pageData[route.name]?.checked || '')
const isDisabled = ref(!pageData[route.name])
function change(val) {
    pageData.set(route.name, {
        unit: unit.value,
        height: unit.value === 'ft/in' ? height.value.replace(/\D/g, '') : height_cm.value.replace(/\D/g, ''),
        checked: checked.value
    })
    push()
}


const isFocused = ref(false)
const isError = ref(false)
let placeholder_1 = ref("_ft")
let placeholder_2 = ref("__in")
const isErrorText = ref('Height must be greater than or equal to 90 cm')

// ft/in 验证
const validate = () => {
    let val = height.value.replace(/\D/g, '')
    isErrorText.value = "Height must be greater than or equal to 3 ft"
    
    if (val.length == 3 && (val - 0) % 100 >= 3) {
        isFocused.value = true
        isError.value = false
        isDisabled.value = !checked.value
    } else {
        isFocused.value = false
        isError.value = true
        isDisabled.value = true
    }
}

const onInput = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    let oldVal = height.value.replace(/\D/g, '')
    
    if (e.target.value.length < height.value.length) {
        if (oldVal.length == 3) {
            height.value = val[0] + ' ft ' + val[1]
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
        if (val.length == 1) {
            height.value = val + ' ft'
            placeholder_1.value = ''
            e.target.value = height.value
        } else if (val.length == 2) {
            height.value = val[0] + ' ft ' + val[1]
            placeholder_1.value = ''
            placeholder_2.value = "_in"
            e.target.value = height.value
        } else if (val.length == 3) {
            height.value = val[0] + ' ft ' + val[1] + val[2] + ' in'
            placeholder_1.value = ''
            placeholder_2.value = ''
            e.target.value = height.value
        }
    }
    validate()
}

// cm 验证
const validate1 = () => {
    isErrorText.value = "Height must be greater than or equal to 90 cm"
    if (height_cm.value < 90 || height_cm.value === '') {
        isFocused.value = false
        isError.value = true
        isDisabled.value = true
    } else {
        isFocused.value = true
        isError.value = false
        isDisabled.value = !checked.value
    }
}

const onInput1 = (e) => {
    let val = e.target.value.replace(/\D/g, '')
    if (val.length > 3) val = val.slice(0, 3)
    height_cm.value = val
    validate1()
}

// 单位切换重置
watch(unit, () => {
    isError.value = false
    isDisabled.value = true
    isFocused.value = false
    height.value = ''
    height_cm.value = ''
    placeholder_1.value = "_ft"
    placeholder_2.value = "__in"
    checked.value = false
})

// 复选框监听
watch(checked, () => {
    if (unit.value === 'ft/in') {
        validate()
    } else {
        validate1()
    }
})

// 输入框聚焦
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

        <!-- ft/in 输入框 -->
        <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }" v-if="unit === 'ft/in'">
            <input ref="inputRef" @keydown.delete="onDelete" @input="onInput" class="input" placeholder="" @focus="isFocused = true" />
            <div class="input-text">
                <span>{{ height }}</span>
                <span class="placeholder">{{ placeholder_1 }}</span>
                <span class="placeholder">{{ placeholder_2 }}</span>
            </div>
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <!-- cm 输入框 -->
        <div @click="focusInput" v-if="unit === 'cm'" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input ref="inputRef" v-model="height_cm" @input="onInput1" class="input" placeholder="__" @focus="isFocused = true" />
            <div class="input-text">
                <span class="unit">{{ height_cm }}</span>
                <span>cm</span>
            </div>
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        
        <div class="checkbox-wrap">
            <div @click="checked = !checked" class="checkbox-custom" :class="{ 'active': checked }"></div>
            <div class="lable">{{ pageText.checkboxLabel }}</div>
        </div>

        <div class="text">
            <span>{{ pageText.text[0] }}</span>
            <span class="underline">{{ pageText.text[1] }}</span>
            <span>{{ pageText.text[2] }}</span>
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
            background: transparent;
            border: none;
            outline: none;
            font-size: 20px;
            color: #fff;
            caret-color: #fff;
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

    .input-wrapper.error {
        border-color: #ff3b30;
    }

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

    .checkbox-wrap {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 8px;
        line-height: 18px;
        cursor: pointer;
        margin-top: 16px;

        .lable {
            max-width: 469px;
            color: #969696;
            font-size: 14px;
            font-family: Laient, sans-serif;
        }
    }

    .text {
        width: 100%;
        color: #fff;
        font-size: 14px;
        font-family: Laient, sans-serif;
        margin-top: 24px;

        .underline {
            text-decoration: underline;
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