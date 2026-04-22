<script setup>
import { ref } from 'vue'
import Select from './module/select.vue'
import { PushControl } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'
import { getSubscriptionList } from '@/api/system/index.js'
const pushControl = new PushControl()
getSubscriptionList().then(res => {
    console.log(res)
})
const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const props = defineProps({
    bgImageList: Array
})
console.log(props.bgImageList, pageText)
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
            <div class="box1-content">
                <div class="box1-itam left">
                    <div class="box1-itam-title">Now</div>
                    <div class="box1-itam-content">
                        <div class="textBox1">
                            <div class="text1">Body fat</div>
                            <div class="text2">20%-24%</div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Energy Level</div>
                            <div class="bar-ul">
                                <div class="bar-li black"></div>
                                <div class="bar-li black"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                            </div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Tai Chi level</div>
                            <div class="bar-ul">
                                <div class="bar-li black"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="box1-itam right">
                    <div class="box1-itam-title">Now</div>
                    <div class="box1-itam-content">
                        <div class="textBox1">
                            <div class="text1">Body fat</div>
                            <div class="text2">20%-24%</div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Energy Level</div>
                            <div class="bar-ul">
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                            </div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Tai Chi level</div>
                            <div class="bar-ul">
                                <div class="bar-li blue"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                                <div class="bar-li"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text">{{ pageText.text1 }}</div>
        </div>
        <div class="title">{{ pageText.title }}</div>
        <div class="box2">
            <div class="box2-bml"></div>
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
        display: flex;
        flex-flow: wrap;

        img {
            width: 100%;
        }

        .box1-content {
            width: 100%;
            height: 338px;
            background: #FFF;

            .box1-itam {
                float: left;
                width: 50%;
                height: 100%;

                .box1-itam-title {
                    width: 100%;
                    height: 50px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #EDF0F3;
                    color: #242424;
                    font-family: Poppins;
                    font-size: 20px;
                    font-weight: 600;
                }

                .box1-itam-content {
                    width: 100%;
                    height: 288px;
                    box-sizing: border-box;
                    padding: 0 56px 0 40px;

                    .textBox1 {
                        text-align: left;
                        margin-top: 40px;
                    }

                    .textBox2 {
                        text-align: left;
                        margin-top: 24px;
                    }

                    .text1 {
                        font-family: Poppins;
                        font-size: 16px;
                        color: #959799;
                        font-weight: 500;
                        line-height: 24px;
                    }

                    .text2 {
                        color: #242424;
                        font-family: Poppins;
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 30px;
                    }

                    .bar-ul {
                        width: 338px;
                        height: 5px;
                        display: flex;
                        justify-content: space-between;
                        margin-top: 16px;

                        .bar-li {
                            width: 64.4px;
                            height: 100%;
                            border-radius: 4px;
                            background: #EDF0F3;
                        }

                        .black {
                            background: #000;
                        }

                        .blue {
                            background: #2E73E0;
                        }
                    }
                }


            }

            .left {}

            .right {

                .box1-itam-title {
                    background-color: #2E73E0;
                    color: #FFF;
                }

                .box1-itam-content {
                    .text2 {
                        color: #2E73E0;
                    }
                }

            }
        }

        .text {
            width: 100%;
            margin-top: 16px;
        }
    }

    .text {

        color: #959799;
        text-align: center;
        font-family: Poppins;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
    }

    .title {
        margin-top: 96px;
        color: #242424;
        text-align: center;
        font-family: Poppins;
        font-size: 40px;
        font-weight: 600;
        line-height: 60px;
    }

    .box2 {
        width: 100%;

        .box2-bml {
            width: 100%;
            padding: 40px 56px;
        }
    }
}

@media (max-width: 767px) {}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {}
</style>