<script setup>
import { ref, useSlots, onMounted } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()
const viewMode = route.query.viewMode
const num = window.languageData.HaveYouEverSelected
const pageText = viewMode == 0 ? num[0] : num[1]


function change(val) {
  console.log(val)
}
console.log(pageText, viewMode)
</script>

<template>
  <img class="img" src="../assets/militaryCalisthenics.png" alt="" srcset="">
  <div class="title">{{ pageText.title }}</div>
  <div v-if="viewMode == 0" class="option1">
    <div class="subtitle">
      <span class="sub1">{{ pageText.text1[0] }}</span>
      <span class="sub2">{{ pageText.text1[1] }}</span>
    </div>
    <div class="subtitle">
      <span class="sub1">{{ pageText.text2[0] }}</span>
      <span class="sub2">{{ pageText.text2[1] }}</span>
      <span class="sub1">{{ pageText.text2[2] }}</span>
    </div>
    <div class="btn1">
      <div class="btn-container" :style="'justify-content:' + btnAlign">
        <div class="continue-btn" @click="emit('click')">
          <div>Continue</div>
          <img src="@/assets/select-item-icon.png">
        </div>
      </div>
    </div>

  </div>
  <div v-if="viewMode == 1" class="option2">
    <div class="subtitle">
      <span class="sub1">{{ pageText.text1[0] }}</span>
    </div>
    <div class="subtitle">
      <span class="sub1">{{ pageText.text2[0] }}</span>
      <span class="sub2">{{ pageText.text2[1] }}</span>
    </div>
    <div class="btn2">
      <div class="btn-container" :style="'justify-content:' + btnAlign">
        <div class="continue-btn" @click="emit('click')">
          <div>Continue</div>
          <img src="@/assets/select-item-icon.png">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.img {
  margin-top: 42px;
  width: 280px;
}

.title {
  font-size: 40px;
  font-family: Laien;
  max-width: 600px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.option1 {
  width: 592px;
  position: relative;
}

.option2 {
  width: 540px;
  position: relative;
}

.subtitle {
  font-size: 20px;
  width: 100%;

  .sub1 {
    color: #AAA;
    font-weight: 500;
  }

  .sub2 {
    color: #fff;
    font-weight: 600;
  }
}

.btn1 {
  position: absolute;
  bottom: -128px;
  right: -63px;
}

.btn2 {
  position: absolute;
  bottom: -118px;
  right: -89px;
}

@media (max-width: 600px) {

  .img{
    width: 180px;
  }
  .title{
    font-size: 28px;
    padding: 0 20px;
  }
  .option1,
  .option2 {
    width: 100vw;
  }

  .subtitle {
    width: 100vw;
    padding: 0 20px;

    .sub1 {
      font-size: 16px;
    }

    .sub2 {
      font-size: 16px;
    }
  }

  .btn1 {
    position: initial;
  }

  .btn2 {
    position: initial;
  }
}
</style>