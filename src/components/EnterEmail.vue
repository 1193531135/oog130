<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref } from 'vue'

const pageData = new PageData()
pageData
const route = useRoute()
const pageText = window.languageData[route.name]


function change(val) {
    pageData.set(route.name, email.value)
    push()
}
const isDisabled = ref(!pageData[route.name])
const email = ref(pageData[route.name] || '')
const isFocused = ref(false)
const isError = ref(false)
//提示文本
const isErrorText = ref('Please enter your email address')
//邮箱正则 
const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// ft/in输入框
// 验证逻辑：失焦时检查是否为空
const validate = () => {
    let istrue = reg.test(email.value)
    if (istrue) {
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
    console.log(e.target.value)
    validate()
}
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

        <div class="title">
            <span>{{ pageText.title[0] }}</span>
            &nbsp;
            <span style="color: #2E73E0;">{{ pageText.title[1] }}</span>
            &nbsp;
            <span>{{ pageText.title[2] }}</span>
        </div>
        <div class="description">{{ pageText.text }}</div>
        <div class="inputLable">{{ pageText.inputLable }}</div>
        <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input ref="inputRef" v-model="email" @input="onInput" class="input" placeholder="name@example.com"
                @focus="isFocused = true" @blur="validate" />

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>
        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>

        <div class="promptBox">
            ✅ &nbsp;&nbsp; {{ pageText.Subheading }}
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
    width: 628px;

    .promptBox {

        display: flex;
        width: 428px;
        height: 56px;
        padding: 0 24px;
        align-items: center;
        gap: 16px;
        box-sizing: border-box;
        background: #E8F5E7;
        border-radius: 8px;
        margin-top: 24px;
    }

    .title {
        margin-top: 69px;
        width: 650px;
        text-align: center;
    }

    .inputLable {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #242424;
        margin-top: 14px;
    }

    // 输入框样式
    .input-wrapper {
        width: 428px;
        box-sizing: border-box;
        margin: 0 6px;
        height: 64px;
        padding: 0px 11px;
        display: flex;
        align-items: center;
        background-color: #EDF0F3;
        border: 1px solid #E0E3E5;
        transition: border-color 0.2s;
        margin-top: 29px;
        border-radius: 8px;

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
            color: #242424;
            /* 默认白色 */
            caret-color: #242424;
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
                color: #C7C9CC;
            }
        }

        .input::placeholder {
            color: #C7C9CC;
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
        width: 428px;
        margin-top: 8px;
    }

    .description {
        margin-top: 16px;
        color: #AAA;
        text-align: center;
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

        .promptBox {
            width: 100%;
        }

        .title {
            width: 100%;
        }

        .input-wrapper {
            width: 100%;
        }

        .error-text {
            width: 100%;
        }
    }

}
</style>