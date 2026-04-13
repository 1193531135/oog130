<script setup>
import {useRoute} from 'vue-router'
import {PageData} from "@/tool/index.js";
import {push} from '@/tool/index.js'
import {ref, computed, onMounted, nextTick} from 'vue'
import dayjs from 'dayjs';

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]

const value = ref(pageData[route.name] ? dayjs(pageData[route.name]):null) // 输入框的值，初始为页面数据中的值

const displayValue = computed(() => {
  return value.value
      ? value.value.format('DD/MM/YYYY')
      : ''
})

function change(val) {
  console.log(val)
  pageData.set(route.name, val.format('DD/MM/YYYY'))
}

function goIt() {
  push()
}

const open = ref(false)

const isFocused = ref(false)
const isError = ref(false)
//提示文本
onMounted(() => {
  nextTick(() => {
  })
})
</script>

<template>
  <div class="text-page">
    <div class="title">{{ pageText.title }}</div>
    <div class="textBox-content">
      <div class="inputLable">{{ pageText.inputLable }}</div>

      <!-- 输入框容器 -->
      <div class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
        <a-date-picker :showToday="false" v-model:value="value" format="YYYY-MM-DD" @change="change" :getPopupContainer="(node) => node.parentNode"></a-date-picker>
        <div class="input-show" @click="open = true" @blur="open.value = false">
          <div>
            <div class="input-label">Select Date</div>
            <div class="input-value">{{ displayValue }}</div>
          </div>
          <svg width="23" height="26" viewBox="0 0 23 26" fill="none">
            <path d="M22 10.3333H1M16.1667 1V5.66667M6.83333 1V5.66667M6.6 24.3333H16.4C18.3602 24.3333 19.3403 24.3333 20.089 23.9519C20.7475 23.6163 21.283 23.0809 21.6185 22.4223C22 21.6736 22 20.6935 22 18.7333V8.93333C22 6.97315 22 5.99306 21.6185 5.24437C21.283 4.5858 20.7475 4.05037 20.089 3.71481C19.3403 3.33333 18.3602 3.33333 16.4 3.33333H6.6C4.63982 3.33333 3.65972 3.33333 2.91103 3.71481C2.25247 4.05037 1.71703 4.5858 1.38148 5.24437C1 5.99306 1 6.97315 1 8.93333V18.7333C1 20.6935 1 21.6736 1.38148 22.4223C1.71703 23.0809 2.25247 23.6163 2.91103 23.9519C3.65972 24.3333 4.63982 24.3333 6.6 24.3333Z" stroke="#C7C9CC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="texBox">
        <div class="texBox-top">
          <span class="icon">✍️</span>
          <span class="checkboxLabel">{{ pageText.textBox.title }}</span>
        </div>
        <div class="texBox-top">
          <span class="icon" style="opacity: 0;">☝️</span>
          <span class="text">{{ pageText.textBox.text }}</span>
        </div>
      </div>
    </div>

     <div class="btn-container">
            <div class="continue-btn" :class="{ 'disabled': isDisabled }" @click="goIt">
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
  width: 513px;
  box-sizing: border-box;
  .title {
    text-align: center;
  }
  .textBox-content{
    width: 428px;
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
    display: flex;
    align-items: center;
    border-radius: 8px;
    border: 1.5px solid #E0E3E5;
    transition: border-color 0.2s;
    position: relative;
    margin-top: 8px;
    :deep(.ant-picker){
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      cursor: pointer;
      background-color: rgba(0,0,0,0);
      color: rgba(0,0,0,0);
      .ant-picker-input{ display: none }
      // 弹窗样式
      .ant-picker-dropdown{
        .ant-picker-panel,.ant-picker-date-panel,
        .ant-picker-content{ width: 100% }
      }
    }
    .input-show{
      background-color: #EDF0F3;
      padding: 10px 20px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .input-label{
        font-size: 15px;
        color: #959799;
        font-weight: 400
      }
      .input-value{
        margin-top: 4px;
        height: 27px;
      }
    }

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
    background: #EDF0F3;

    .icon {
      font-size: 26px;
      margin-right: 8px;
    }

    .texBox-top {
      display: flex;
      width: 100%;

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

  .develop {
    background-color: #FAEBEB;
  }

  .lose {
    background-color: #EBF0F9;
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
    .textBox-content{
      width: auto;
      .inputLable{
        margin-top: 14.24vh;
        font-size: 16px;
      }
    }
    .texBox{
      .icon{ font-size: 20px }
    }
    .lable {
      width: 80vw;
    }
  }
}
</style>
