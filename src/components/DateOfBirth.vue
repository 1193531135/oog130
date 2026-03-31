<script setup>
import { ref } from 'vue'
import Select from './module/select.vue'
import { push } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const selectValue = ref(pageData[route.name])

const value1 = ref();
const dateofBirth = ref('')
const isFocused = ref(false)
const isError = ref(false)
let placeholder_1 = ref("DD/MM/YYYY")
let placeholder_2 = ref("")
//提示文本
const isErrorText = ref('Please enter a valid date of birth')
function change(val) {
  // 存储数据
  pageData.set(route.name, val)
  //
  push()
}
const validate = () => {
  let val = dateofBirth.value.replace(/\D/g, '').length

  // isErrorText.value = "Height must be greater than or equal to 3 ft"
  console.log(val)
  if (val==8) {
    isFocused.value = true
    isError.value = false

  } else {
    isFocused.value = false
    isError.value = true
  }
}
const onInput = (e) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  console.log('onInput正在输入：', e.target.value.length, '-------', dateofBirth.value.length)
  // 这里写你要的逻辑：限制数字、格式化、校验等
  let val = e.target.value.replace(/\D/g, '') // 去掉非数字
  let oldVal = dateofBirth.value.replace(/\D/g, '')
  console.log('onInput去掉非数字：', '新：：' + val, e.target.value, '旧：' + oldVal, dateofBirth.value)
  if (val.length > oldVal.length) {
    if (val.length == 1) {
      if (val > 3) {
        placeholder_1.value = "MM/YYYY"
        dateofBirth.value = '0' + val + '/'
      } else {
        placeholder_1.value = "D/MM/YYYY"
        dateofBirth.value = val
      }
    } else if (val.length == 2) {
      placeholder_1.value = "MM/YYYY"
      if (val > 31) {
        dateofBirth.value = 31 + '/'
      } else {
        dateofBirth.value = val + '/'
      }
    } else if (val.length == 3) {
      if (val[2] > 3) {
        placeholder_1.value = "YYYY"
        dateofBirth.value = dateofBirth.value + '0' + val.slice(2) + '/'
      } else {
        placeholder_1.value = "M/YYYY"
        dateofBirth.value = dateofBirth.value + val.slice(2)
      }

    } else if (val.length == 4) {
      placeholder_1.value = "YYYY"
      if (val[2] - 0 + val[3] - 0 > 31) {
        dateofBirth.value = val[0] + val[1] + '/' + '31' + '/'
      } else {
        dateofBirth.value = dateofBirth.value + val[3] + '/'
      }
    } else if (val.length == 5) {
      placeholder_1.value = "YYY"
      dateofBirth.value = dateofBirth.value + val[4]
    } else if (val.length == 6) {
      placeholder_1.value = "YY"
      dateofBirth.value = dateofBirth.value + val[5]
    } else if (val.length == 7) {
      placeholder_1.value = "Y"
      dateofBirth.value = dateofBirth.value + val[6]
    } else if (val.length == 8) {
      placeholder_1.value = ""
      if (val.slice(4) > year) {
        dateofBirth.value = day + '/' + month + '/' + year
      } else {
        dateofBirth.value = dateofBirth.value + val[7]
      }
    }
    e.target.value = dateofBirth.value
  } else {
    if (oldVal.length == 8) {
      placeholder_1.value = "Y"
      dateofBirth.value = dateofBirth.value.slice(0, -1)
    } else if (oldVal.length == 7) {
      placeholder_1.value = "YY"
      dateofBirth.value = dateofBirth.value.slice(0, -1)
    } else if (oldVal.length == 6) {
      placeholder_1.value = "YYY"
      dateofBirth.value = dateofBirth.value.slice(0, -1)
    } else if (oldVal.length == 5) {
      placeholder_1.value = "YYYY"
      dateofBirth.value = dateofBirth.value.slice(0, -1)
    } else if (oldVal.length == 4) {
      placeholder_1.value = "M/YYYY"
      dateofBirth.value = dateofBirth.value.slice(0, -2)
    } else if (oldVal.length == 3) {
      placeholder_1.value = "MM/YYYY"
      dateofBirth.value = dateofBirth.value.slice(0, -1)
    } else if (oldVal.length == 2) {
      placeholder_1.value = "D/MM/YYYY"
      dateofBirth.value = dateofBirth.value.slice(0, -2)
    } else if (oldVal.length == 1) {
      placeholder_1.value = "DD/MM/YYYY"
      dateofBirth.value = ''
    }
    e.target.value = dateofBirth.value
  }


}


</script>

<template>
  <div class="page-con">
    <div class="title">{{ pageText.title }}</div>
    <div class="inputLable">{{ pageText.inputLable }}</div>
    <div class="input-wrapper" :class="{
      error: isError,
      focus: isFocused
    }">
      <input @input="onInput" class="input" placeholder="" @focus="isFocused = true" @blur="validate" />
      <div class="input-text">
        <span>{{ dateofBirth }}</span>
        <span class="placeholder">{{ placeholder_1 }}</span>
        <!-- <span class="placeholder">{{ placeholder_2 }}</span> -->
      </div>

      <!-- 错误提示图标 -->
      <div v-if="isError" class="error-icon">!</div>
    </div>

    <!-- 错误提示文字 -->
    <p v-if="isError" class="error-text">{{ isErrorText }}</p>

    <div class="textBox">
      <p class="textBox-title">{{ pageText.textBox.title }}</p>
      <p class="textBox-content ">{{ pageText.textBox.text }}</p>
    </div>
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

<style lang="less" scoped>
.page-con {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 501px;
  box-sizing: border-box;
}

.title {
  font-size: 40px;
  font-family: Laien;
  font-weight: 700;
  text-align: center;
  margin-bottom: 34px;
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
    font-size: 18px;
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
  // position: absolute;
  margin-left: 260px;
  margin-top: 112px;
}

@media (max-width: 768px) {
  .page-con {
    width: auto;
    padding: 0 24px;
  }

  .title {
    font-size: 30px;
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {}
</style>