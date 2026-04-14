<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref } from 'vue'
import Select from './module/select.vue'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
const options = pageText.selectOptions.map((i, index) => ({ label: i, value: index }))


function change(val) {
    pageData.set(route.name, val)
    push()
}


</script>

<template>
    <div class="text-page">
        <div class="box">
            <img  class="Close" src="../assets/image/Close.webp" alt="">
            <div class="Subheading-box">
                <div class="icon">🎉</div>
                <span>{{ pageText.Subheading }}</span>
            </div>
            <div class="title">
                <span style="color: #2E73E0;">{{ pageText.title[0] }}</span>
                &nbsp;
                <span>{{ pageText.title[1] }}</span>
            </div>
            <Select v-model="selectValue" :options="options" class="select" @change="change">
                <template #default="{ itemData }">
                    <div>{{ itemData.label }}</div>
                </template>
            </Select>

        </div>
    </div>
</template>

<style scoped lang="less">
.text-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #F8F8F8;
    width: 482px;
    height: 100%;

    .box {
        position: relative;
        margin-top: 135px;
        width: 100%;
        padding: 64px 40px 60px 40px;
        background-color: #FFF;
        box-sizing: border-box;
        .Close{
            width: 44px;
            height: 44px;
            position: absolute;
            top: 16px;
            right: 16px;
        }
        .Subheading-box {
            position: absolute;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;
            height: 58px;
            background-color: #5CB655;
            border-radius: 8px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.06);
            padding: 16px;
            box-sizing: border-box;
            transform: rotate(-4.751deg);
            left: 38px;
            top: -35px;
            color: #FFF;

            .icon {
                width: 26px;
                height: 26px;
                display: flex;
                justify-content: center;
                align-items: center;
                // background-color: #3A3A3A;
                margin-right: 8px;
            }
        }

        .title {
            font-size: 30px;
        }

        /deep/.select-container {
            .select-item {
                margin-top: 20px;
                height: 72px;
                width: 100%;
                box-sizing: border-box;
                padding-left: 24px;
                background-color: #EDF0F3;
                display: flex;
                align-items: center;
            }

            .select-item :hover {
                // background-color: rgb(79, 79, 79);
            }
        }
    }


    .btn {
        // position: absolute;
        margin-left: 262px;
        margin-top: 84px;
    }
}

@media (max-width: 600px) {
    .text-page {
        width: 100vw;
        padding: 0 16px;
        box-sizing: border-box;

        .box {
            margin-top: 72px;
            padding: 60px 16px 16px 16px;

            .title {
                font-size: 24px;
            }
        }
    }

}
</style>