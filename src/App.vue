<script setup>
import { ref,onMounted } from "vue";
import { readLanguage } from "@/tool";
const loaded = ref(false);

// 加载资源
async function loadResources() {
  // 语言不需要双向绑定直接挂载在windows
  window.languageData = await readLanguage()
  loaded.value = true;
}

onMounted(() => {
  loadResources();
})
</script>

<template>
  <div class="page-container" v-if="loaded">
    <div class="head-container">
      <img src="./assets/title-logo.png" class="head-logo">
      <div class="head-text">Military Calisthenics </div>
    </div>
    <div class="progress-bar">
      <div class="back-btn"></div>
      <div class="progress-con"></div>
      <div class="progress"></div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.page-container{
  background-color: rgb(29,26,26);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: center;
  font-family: Poppins;
  .head-container{
    display: flex;
    align-items: center;
    padding: 1vw 2.2vw;
    box-sizing: border-box;
    width: 100%;
    .head-logo{
      height: 44px;
      width: 44px;
      margin-right: 16px;
    }
    .head-text {
      color: #85AD1C;
      font-size: 24px;
      text-transform: uppercase;
      font-family: Anton;
      letter-spacing: 1px
    }
  }
  .progress-bar{
    height: 44px;
  }
}

@media (max-width: 768px) {
  .page-container{
    .head-container{
      padding: 16px 24px;
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}

</style>