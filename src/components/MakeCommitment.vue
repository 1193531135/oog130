<script setup>
import { useRoute } from 'vue-router'
import { PageData } from "@/tool/index.js";
import { push } from '@/tool/index.js'
import { ref } from 'vue'
import Select from './module/select.vue'

const pageData = new PageData()
const route = useRoute()
const pageText = window.languageData[route.name]
const options = pageText.selectOptions.map((i, index) => ({ label: i.label, value: index }))


function change(val) {
    push()
}


</script>

<template>
    <div class="text-page">
        <div class="box">
            <div class="Subheading-box">
                <div class="icon">🎉</div>
                <span>{{ pageText.Subheading }}</span>
            </div>
            <div class="title">
                <span style="color: #57810D;">{{ pageText.title[0] }}</span>
                <span>{{ pageText.title[1] }}</span>
            </div>
            <div class="select-container">
                <div v-for="value in options" :key="value.value" class="select-item">
                    <span>{{ value.label }}</span>
                </div>
            </div>
        </div>
    </div> 
</template>

<style scoped lang="less">
.text-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 469px;
    height: 100%;

    .box {
        margin-top: 135px;
        width: 100%;
        padding: 39px 19px 26px 19px;
        background-color: #242424;
        box-sizing: border-box;

        .Subheading-box {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 500;

            .icon {
                width: 44px;
                height: 44px;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #3A3A3A;
                margin-right: 20px;
            }
        }

        .title {
            font-size: 30px;
        }

        .select-container {
            .select-item {
                margin-top: 20px;
                height: 72px;
                width: 100%;
                box-sizing: border-box;
                padding-left: 24px;
                background-color: #3A3A3A;
                display: flex;
                align-items: center;
            }
            .select-item :hover {
                background-color: rgb(79, 79, 79);
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
        padding: 0 20px;
        box-sizing: border-box;
    }

}
</style>