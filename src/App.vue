<script setup>
import { ref,onMounted,computed,watch } from "vue";
import { readLanguage } from "@/tool";
import { useRoute } from "vue-router";
import { registerList } from "@/router/index.js";
import { getFirestoreDataByUid, createAnonymousAccount } from "@/config/firebase.js"
import  { getPriceList } from "@/api/system"
import config from "@/config/index.js";
import { Mixpanel } from "@/config/mixpanel.js"

const loaded = ref(false);
const route = useRoute()
const routeIndex = computed(() => registerList.findIndex(i=> i.path === route.path) )

function getFallbackUid() {
  const cachedUid = window.sessionStorage.getItem("uid");
  if (cachedUid) {
    return cachedUid;
  }

  const fallbackUid = `web_guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  window.sessionStorage.setItem("uid", fallbackUid);
  return fallbackUid;
}

// watch(routeIndex, (newVal) => {
//   // 路由变化时预加载下一个页面
//   registerList[newVal + 1]?.meta.preload()
// })

// 加载资源
async function loadResources() {
  // 语言不需要双向绑定直接挂载在windows
  window.languageData = await readLanguage()
  loaded.value = true;
}

const back = () => {
  if(routeIndex.value > 0){
    window.history.back()
  }
}

onMounted(async () => {
  // 创建匿名账号
  await createAnonymousAccount();
  // 初始化mixpanel
  const mixpanel = new Mixpanel();
  mixpanel.init();
  // const fetchedData = await getFirestoreDataByUid();
  loadResources();
  // if (fetchedData) {
  //   console.log('updateOnBoardingRecordInfo', fetchedData);
  // }
})
</script>

<template>
  <div class="page-container" v-if="loaded">
    <div class="head-container">
      <img src="./assets/back.webp" class="back-btn" @click="back" v-show="routeIndex > 0">
      <img src="./assets/title-logo.webp" class="head-logo">
      <div class="head-text">Tai CHi</div>
    </div>
    <div class="progress-bar" v-show="!registerList[routeIndex].config.progressHidden">
      <div class="progress-con">
        <div class="progress" :style="'width:' + ((routeIndex + 1) / (registerList.length) * 100) + '%'"></div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="less" scoped>
.page-container{
  background-color: #F8F8F8;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #242424;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: center;
  font-family: Poppins;
  .head-container{
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding: 26px 0 26px 60px;
    box-sizing: border-box;
    width: 100%;
    .back-btn{ height: 44px;width: 44px; margin-right: 12px;cursor: pointer }
    .head-logo{
      height: 27px;
      width: 27px;
      margin-right: 7px;
    }
    .head-text {
      color: #2E73E0;
      font-size: 27px;
      text-transform: uppercase;
      font-family: Fugaz One,serif;
    }
  }
  .progress-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-shrink: 0;
    gap: 24px;
    border-radius: 15px;
    margin-bottom: 50px;
    box-sizing: border-box;
    .progress-con{
      flex: 1;
      height: 5px;
      background-color: rgba(46, 46, 46, 0);
      .progress{
        background-color: var(--style-color);
        height: 100%;
        transition: width 0.3s;
      }
    }
    .progress-text{ color: #AAA }
  }
}

@media (max-width: 768px) {
  .page-container{
    .head-container{
      padding: 0 16px;
      .head-logo{
        height: 24px;
        width: 24px;
      }
      .head-text {
        font-size: 24px;
        line-height: 23px;
      }
    }
    .progress-bar{
      margin-bottom: 16px;
      margin-top: -2px;
      .back-btn{ height: 24px;width: 24px }
      .progress-con{
        flex: 1;
        height: 2px;
      }
      .progress-text{ font-size: 12px }
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}

</style>
