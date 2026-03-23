<script setup>
</script>

<template>
  <div class="page-container">
    <div class="head-container">
      <img src="./assets/title-logo.png" class="head-logo">
      <div class="head-text">Military Calisthenics </div>
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
      height: 3.05vw;
      width: 3.05vw;
      margin-right: 1.1vw;
    }
    .head-text {
      height: 2.5vw;
      width: 15.83vw;
      color: #85AD1C;
      font-size: 1.66vw;
    }
  }
}
/* iphone */
@media screen and (max-width: 389px) {
  body {
    background-color: lightblue;
  }
}

/* ipad */
@media screen and (min-width: 390px) and (max-width: 1024px) {
  body {
    background-color: lightgreen;
  }
}

</style>