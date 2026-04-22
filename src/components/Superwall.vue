<script setup>
import { ref } from 'vue'
import Select from './module/select.vue'
import { PushControl } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'
const pushControl = new PushControl()

const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const props = defineProps({
    bgImageList: Array
})
console.log(props.bgImageList)
function change(val) {
    // 存储数据
    //   pageData.set(route.name,val)
    //
    pushControl.push()
}
</script>

<template>
    <div class="text-page">
        <div class="box1">
            <img :src="bgImageList[0]" alt="">
        </div>
    </div>
</template>

<style lang="less" scoped>
.text-page {
    width: 920px;
    text-align: center;
    box-sizing: border-box;

    .box1 {
        width: 100%;
    }
}

@media (max-width: 767px) {}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {}
</style>