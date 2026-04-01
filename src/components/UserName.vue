<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref } from 'vue'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]


function change(val) {
    push()
}

const userName = ref('')
const isFocused = ref(false)
const isError = ref(false)
//提示文本
const isErrorText = ref('Please enter your email address')
//邮箱正则 
const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// ft/in输入框
// 验证逻辑：失焦时检查是否为空
const validate = () => {
    let istrue = reg.test(userName.value)
    if (istrue) {
        isFocused.value = true
        isError.value = false

    } else {
        isFocused.value = false
        isError.value = true
    }
}
const onInput = (e) => {
    console.log(e.target.value)

}

</script>

<template>
    <div class="text-page">
        <div class="promptBox">
            ✅ &nbsp;&nbsp; {{ pageText.Subheading }}
        </div>
        <div class="title">
            {{ pageText.title }}
        </div>
        <div class="inputLable">{{ pageText.inputLable }}</div>
        <div class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input v-model="userName" @input="onInput" class="input" placeholder="name@example.com"
                @focus="isFocused = true" @blur="validate" />

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>
        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        <div class="btn">
            <div class="btn-container">
                <div class="continue-btn" @click="change">
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
    width: 501px;

    .promptBox {

        display: flex;
        width: 432px;
        height: 56px;
        padding: 0 24px;
        align-items: center;
        gap: 16px;
        box-sizing: border-box;
        background: #3A3A3A;
    }

    .title {
        margin-top: 12px;
        width: 650px;
        text-align: center;
    }

    .inputLable {
        width: 100%;
        font-size: 20px;
        font-weight: 500;
        color: #fff;
        margin-top: 23px;
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

    .description {
        margin-top: 32px;
        color: #fff;
        text-align: center;
    }

    .btn {
        // position: absolute;
        margin-left: 262px;
        margin-top: 84px;
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
    }

}
</style>