<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref, computed } from 'vue'



const pageData = new PageData()
pageData
const route = useRoute()
const pageText = window.languageData[route.name]
console.log('pageText', pageText)
const selectOptions = pageText.selectConfig.selectOptions
const unit = ref(selectOptions[0])
function change(val) {
    push()
}


const height = ref('')
const height_cm = ref('')
const isFocused = ref(false)
const isError = ref(false)
let placeholder_1 = ref("_ft")
let placeholder_2 = ref("__in")
const checked = ref(false)// 复选框状态
//提示文本
const isErrorText = ref('Height must be greater than or equal to 90 cm')

// ft/in输入框
// 验证逻辑：失焦时检查是否为空
const validate = () => {
    let val = height.value.replace(/\D/g, '').length

    isErrorText.value = "Height must be greater than or equal to 3 ft"
    console.log(val)
    if (val == 3) {
        isFocused.value = true
        isError.value = false

    } else {
        isFocused.value = false
        isError.value = true
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

}
// cm输入框
// 验证逻辑：失焦时检查是否为空
const validate1 = () => {
    isErrorText.value = "Height must be greater than or equal to 90 cm"
    if (height_cm.value < 90 || height_cm.value === '') {
        isFocused.value = false
        isError.value = true
    } else {
        isFocused.value = true
        isError.value = false
    }
}
const onInput1 = (e) => {
    console.log('正在输入：', e.target.value)
    // 这里写你要的逻辑：限制数字、格式化、校验等
    let val = e.target.value.replace(/\D/g, '') // 去掉非数字
    if (val.length > 3) val = val.slice(0, 3)   // 最多3位
    height_cm.value = val
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
        <!-- ft/in -->
        <div class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }" v-if="unit === 'ft/in'">
            <input @keydown.delete="onDelete" @input="onInput" class="input" placeholder="" @focus="isFocused = true"
                @blur="validate" />
            <div class="input-text">
                <span>{{ height }}</span>
                <span class="placeholder">{{ placeholder_1 }}</span>
                <span class="placeholder">{{ placeholder_2 }}</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>


        <!-- cm -->
        <div v-if="unit === 'cm'" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
            <input v-model="height_cm" @input="onInput1" class="input" placeholder="__" @focus="isFocused = true"
                @blur="validate1" />
            <div class="input-text">
                <span class="unit">{{ height_cm }}</span>
                <span>cm</span>
            </div>

            <!-- 错误提示图标 -->
            <div v-if="isError" class="error-icon">!</div>
        </div>

        <!-- 错误提示文字 -->
        <p v-if="isError" class="error-text">{{ isErrorText }}</p>
        <div class="checkbox-wrap">
            <div @click="checked = !checked" class="checkbox-custom" :class="{ 'active': checked }">

            </div>
            <div class="lable">{{ pageText.checkboxLabel }}</div>
        </div>
        <div class="text">
            <span>{{ pageText.text[0] }}</span>
            <span class="underline">{{ pageText.text[1] }}</span>
            <span>{{ pageText.text[2] }}</span>
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

    // 复选框样式
    /* 隐藏原生复选框 */
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



}

@media (max-width: 600px) {
    .text-page {
        width: 100vw;
        padding: 0 20px;
        box-sizing: border-box;
        .lable{
            width: 80vw;
        }
    }
}
</style>