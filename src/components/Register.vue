<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { PushControl } from '@/tool/index.js'
import { ref } from 'vue'
import { transferSubscription,getSubscriptionList } from "@/api/system/index.js";
import { webConfig } from "@/config/index.js";
import { addFirestoreData } from "@/config/firebase.js";

const pageData = new PageData()

// 加载之前输入的邮箱（如果有的话）
const email = ref(pageData["EnterEmail"] || '')
const password = ref("")
const isFocused = ref(false)
const isError = ref(false)
const loading = ref(false);
//提示文本
const isErrorText = ref('Please enter your email address')
//邮箱正则
const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/

// 验证逻辑：失焦时检查是否为空
const validate = () => {
  let istrue = reg.test(email.value)
  if (istrue) {
    isFocused.value = true
    isError.value = false
  } else {
    isFocused.value = false
    isError.value = true
  }
}
const onInput = (e) => {
  validate()
}
//  聚焦
const inputRef = ref(null)
const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const register = async () => {
  loading.value = true;
  // 通过接口把用户账户升级成正式账户
  let subscriptionId = ""
  const uid = sessionStorage.getItem("uid")
  // 获取订阅id
  let { data } = await getSubscriptionList(uid);
  if (data && data.length) {
    subscriptionId = data.find(item => item.active === 1).subscriptionId;
  }
  const accountInfo = {
    email: email.value,
    password: password.value,
    subscriptionId,
  }
  try {
    // ob 绑定
    await addFirestoreData(uid, pageData);
    // 发起订阅转移(实际上是转为正式账号)
    await transferSubscription(uid, accountInfo);
    // 跳转下载链接
    const a = window.document.createElement("a")
    a.href = webConfig.applink
    a.click()
    loading.value = false;
  } catch (err) {
    // 转移失败，可能是因为用户没有订阅或者其他原因
    // 失败后应该发起邮件
  }
}
</script>

<template>
  <a-spin tip="We are setting up your account after payment. Please keep this page open until the process is completed, otherwise your account may not be created successfully" :spinning="loading" >
    <div class="text-page">
      <div class="title">Create Your Account</div>
      <div class="inputLable">Email</div>
      <div @click="focusInput" class="input-wrapper" :class="{
            error: isError,
            focus: isFocused
        }">
        <input ref="inputRef" v-model="email" @input="onInput" class="input" placeholder="name@example.com"
               @focus="isFocused = true"/>

        <!-- 错误提示图标 -->
        <div v-if="isError" class="error-icon">!</div>
      </div>
      <!-- 错误提示文字 -->
      <p v-if="isError" class="error-text">{{ isErrorText }}</p>
      <div class="inputLable">Password</div>
      <input class="input-wrapper" type="password" v-model="password"/>
      <div class="btn-container">
        <div class="continue-btn" :class="{ 'disabled': !(password && email)  }" @click="register">
          <div class="spacer"></div>
          <div>Register</div>
          <img src="@/assets/continue-icon.webp">
        </div>
      </div>
    </div>
  </a-spin>
</template>

<style scoped lang="less">
.text-page {
  display: flex;
  flex-direction: column;
  align-items: center;

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
    padding: 0 20px;
    box-sizing: border-box;

    .promptBox {
      width: 100%;
    }

    .title {
      width: 100%;
    }

    .input-wrapper {
      margin-top: 8px;
      .input-text {
        font-size: 14px;

        .unit {
          min-width: 25px;
        }
      }

      .input {
        font-size: 14px;
      }

    }
    .promptBox{
      margin-top: 16px;
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