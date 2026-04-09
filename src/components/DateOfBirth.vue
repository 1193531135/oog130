<script setup>
import { ref } from 'vue'
import Select from './module/select.vue'
import { push } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const isDisabled = ref(!pageData[route.name])
const dateofBirth = ref(pageData[route.name] || '')
let placeholder_1 = ref(pageData[route.name] ? "" : "DD/MM/YYYY")


const isFocused = ref(false)
const isError = ref(false)

//提示文本
const isErrorText = ref(pageText.prompt[0])

function change(val) {
  // 存储数据
  pageData.set(route.name, dateofBirth.value)
  push()
}

// 年龄计算工具函数（新增）
const calculateAge = (birthDateStr) => {
  // 拆分 DD/MM/YYYY
  const [day, month, year] = birthDateStr.split('/')
  if (!day || !month || !year || day.length !== 2 || month.length !== 2 || year.length !== 4) return 999
  const birthDate = new Date(year, month - 1, day)
  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const validate = () => {
  // 1. 格式校验：必须是8位纯数字
  const numericValue = dateofBirth.value.replace(/\D/g, '')
  const valLength = numericValue.length

  // 2. 格式不满足
  if (valLength !== 8) {
    isFocused.value = false
    isError.value = true
    isDisabled.value = true
    isErrorText.value = pageText.prompt[0] // 原有提示
    return
  }

  // 3. 格式满足 → 校验年龄是否 ≤100
  const age = calculateAge(dateofBirth.value)
  if (age > 100) {
    isFocused.value = false
    isError.value = true
    isDisabled.value = true
    isErrorText.value = pageText.prompt[1] // 新提示
    return
  }

  // 4. 全部满足
  isFocused.value = true
  isError.value = false
  isDisabled.value = false
}

const onInput = (e) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  // 这里写你要的逻辑：限制数字、格式化、校验等
  let val = e.target.value.replace(/\D/g, '') // 去掉非数字
  let oldVal = dateofBirth.value.replace(/\D/g, '')
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
  validate()
}

const inputRef = ref(null)
const focusInput = () => {
    if (inputRef.value) {
        inputRef.value.focus()
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
    }  " @click="focusInput">
      <input ref="inputRef" @input="onInput" class="input" placeholder="" @focus="isFocused = true" @blur="validate" />
      <div class="input-text">
        <span>{{ dateofBirth }}</span>
        <span class="placeholder">{{ placeholder_1 }}</span>
      </div>

      <div v-if="isError" class="error-icon">!</div>
    </div>

    <p v-if="isError" class="error-text">{{ isErrorText }}</p>

    <div class="textBox">
      <p class="textBox-title">{{ pageText.textBox.title }}</p>
      <p class="textBox-content ">{{ pageText.textBox.text }}</p>
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
</style>