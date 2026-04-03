<script setup>
import { ref,onMounted,computed } from "vue";
import { readLanguage } from "@/tool";
import { useRoute } from "vue-router";
import { registerList } from "@/router/index.js";

const loaded = ref(false);
const route = useRoute()

const routeIndex = computed(() => registerList.findIndex(i=> i.path === route.path) )

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

onMounted(() => {
  loadResources();
})
</script>

<template>
  <div class="page-container" v-if="loaded">
    <div class="head-container">
      <img src="./assets/title-logo.png" class="head-logo">
      <div class="head-text">Tai CHi</div>
    </div>
    <div class="progress-bar" v-show="!registerList[routeIndex].config.progressHidden">
      <img src="@/assets/back.png" class="back-btn" @click="back"/>
      <div class="progress-con">
        <div class="progress" :style="'width:' + (routeIndex / (registerList.length - 1) * 100) + '%'"></div>
      </div>
      <div class="progress-text">{{ routeIndex }}/{{ registerList.length }}</div>
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
  color: white;
  display: flex;
  overflow: auto;
  flex-direction: column;
  align-items: center;
  font-family: Poppins;
  .head-container{
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding: 1vw 2.2vw;
    box-sizing: border-box;
    width: 100%;
    .head-logo{
      height: 27px;
      width: 27px;
      margin-right: 16px;
    }
    .head-text {
      color: #2E73E0;
      font-size: 27px;
      text-transform: uppercase;
      font-family: Anton;
      letter-spacing: 1px
    }
  }
  .progress-bar{
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 60px;
    flex-shrink: 0;
    gap: 24px;
    border-radius: 15px;
    box-sizing: border-box;
    .back-btn{ height: 32px;width: 32px }
    .progress-con{
      flex: 1;
      height: 4px;
      background-color: rgba(46, 46, 46, 1);
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
      padding: 16px 24px;
    }
    .progress-bar{
      padding: 0 24px;
      gap: 5px;
      margin-bottom: 24px;
      .back-btn{ height: 24px;width: 24px }
      .progress-con{
        flex: 1;
        height: 4px;
        background-color: rgba(46, 46, 46, 1);
      }
      .progress-text{ font-size: 12px }
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}

</style>