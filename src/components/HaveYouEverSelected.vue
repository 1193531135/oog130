<script setup>
import { ref, useSlots, onMounted } from "vue";
import { useRoute } from 'vue-router'
const route = useRoute()
const viewMode = route.query.viewMode
const pageText = window.languageData.haveYouEverSelectedMobile
// const pageText = viewMode==0 ? num[0] : num[1]


function change(val) {
  console.log(val)
}
console.log(pageText,viewMode)
</script>

<template>
  <img class="img" src="../assets/militaryCalisthenics.png" alt="" srcset="">
  <div class="title">{{ pageText[0].title }}</div>
</template>

<style scoped lang="less">
.img {
  width: 280px;
}

.title {
  font-size: 40px;
  font-family: Laien;
  max-width: 498px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 34px;
}
</style>