<script setup>
import {ref} from 'vue'
import Select from './module/select.vue'

const pageText = window.languageData.ageQuestion
const selectValue = ref(0)
const options = ["18-29", "30-39", "40-49", "50+"].map((i, index) => ({label: i, value: index}))

function change(val){
  console.log(val)
}
</script>

<template>
  <p style="height: 28px"></p>
  <div class="title">{{ pageText.title }}</div>
  <div class="content">
    <img src="../assets/start.png">
    <div class="select-con">
      <div class="selec-title">{{ pageText.text1 }}</div>
      <Select v-model="selectValue" :options="options" class="select" @change="change">
        <template #default="{ itemData }">
          <div>{{ itemData.label }}</div>
          <img src="../assets/select-item-icon.png">
        </template>
      </Select>
      <div class="end-text">
        <span>{{ pageText.text2[0] }}</span>
        <span class="special-text">{{ pageText.text2[1] }}</span>
        <span>{{ pageText.text2[2] }}</span>
        <span class="special-text">{{ pageText.text2[3] }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.title {
  font-size: 40px;
  font-family: Laien;
  max-width: 498px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 34px;
}

.content {
  display: flex;
  align-items: center;

  > img {
    width: 236px;
    height: 354px;
    margin-right: -20px;
  }
  .select-con{
    width: 328px;
    text-align: center;
    .selec-title{
      font-size: 22px;
      color: var(--style-color);
      margin-bottom: 16px;
      font-weight: 600;
    }
    .select {
      /deep/ .select-item {
        height: 72px;
        justify-content: space-between;
        > img {
          width: 20px;
          height: 20px;
        }
      }
      margin-bottom: 24px;
    }
    .end-text{
      font-size: 16px;
      font-family: Laien, serif;
      .special-text {
        color: var(--style-color);
        text-decoration: underline;
      }
    }
  }
}

@media (max-width: 768px) {
  .title{
    font-size: 30px;
    max-width: 398px;
  }
  .content {
    position: relative;
    > img{ width: 184px;height: 276px }
    .select-con{
      width: 178px;
      .selec-title{
        font-size: 18px
      }
      .select {
        font-size: 15px;
        /deep/ .select-item {
          height: 54px;
        }
      }
      .end-text{
        font-size: 12px;
        position: absolute;
        width: 100%;
        bottom: -44px;
        left: 0;
      }
    }
  }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {

}
</style>