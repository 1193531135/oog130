<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import Select from './module/select.vue'
import { PushControl } from '@/tool/index.js'
import { PageData } from "@/tool/index.js";
import { useRoute } from 'vue-router'
import { getPriceList } from '@/api/system/index.js'
import animationData from '../assets/json/superwall_lottie1.json'
import animationData1 from '../assets/json/superwall_lottie2.json'
const pushControl = new PushControl()
const uid = sessionStorage.getItem("uid");
const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const props = defineProps({
    bgImageList: Array
})
const priceClick = ref(0)
//折扣状态
const discount = ref(false)
//商品列表
const productList = ref([])
// 容器 DOM
const lottieContainer = ref(null)
const lottieContainer1 = ref(null)
// 存储 lottie 实例
let anim = null
let anim1 = null
//控制轮盘显示
const isShow = ref(false)


getPriceList(uid, { uid, lpId: '' }).then(res => {
    productList.value = res.data.products
    console.log(res.data.products)
})
function change(val) {
    // 存储数据
    //   pageData.set(route.name,val)
    //
    pushControl.push()
}


//lottie动画
// 配置项
const lottieOptions = {
    container: lottieContainer.value,
    renderer: 'svg', // 渲染方式：svg / canvas / html
    loop: false, // 是否循环
    autoplay: true, // 自动播放
    // 动画资源：可以是本地JSON / 在线URL
    animationData: animationData,
}
const lottieOptions1 = {
    container: lottieContainer1.value,
    renderer: 'svg', // 渲染方式：svg / canvas / html
    loop: false, // 是否循环
    autoplay: true, // 自动播放
    // 动画资源：可以是本地JSON / 在线URL
    animationData: animationData1,
}
// 挂载后初始化动画
onMounted(() => {
    if (!lottieContainer.value) return

    anim = lottie.loadAnimation({
        container: lottieContainer.value,
        renderer: 'svg',
        loop: false,
        autoplay: false, // 自动播放
        animationData: animationData // 已经导入的JSON
    })
    anim1 = lottie.loadAnimation({
        container: lottieContainer1.value,
        renderer: 'svg',
        loop: false,
        autoplay: false, // 自动播放
        animationData: animationData1 // 已经导入的JSON
    })

    // 监听加载完成
    anim.addEventListener('DOMLoaded', () => {
        console.log('✅ Lottie 动画加载成功')
        // anim.goToAndStop(50, true) // 跳到指定帧
    })

    // 监听动画开始
    anim.addEventListener('data_ready', () => {
        console.log('🎬 动画开始')
    })

    // 监听动画结束
    anim.addEventListener('complete', () => {
        console.log('🏁 动画播放完成')
        anim1?.play()
        discount.value = true
        // 这里可以写关闭弹窗、执行后续逻辑
    })
    setTimeout(() => {
        console.log('显示抽奖弹窗')
        isShow.value = true
        anim?.play()
    }, 5000)
})

// 销毁时清理
onUnmounted(() => {
    if (anim) anim.destroy()
})
function ButtonClick() {
    if (discount.value) {
        // 已经有折扣了，点击按钮应该是去结算或者关闭弹窗
        isShow.value = false
        console.log('去结算')
    } else {
        anim.goToAndStop(300, true)
        // anim?.play()
    }
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
        <div class="box6">
            <div class="box6-left">
                <div class="box6-left-title">1103 people bought workout plans in the last hour</div>
                <div class="box6-left-ul">
                    <div class="box6-left-li">Eric ** 1 month plan</div>
                    <div class="box6-left-li">Jeremy ** 1 month plan</div>
                </div>
                <img class="box6-left-img" :src="bgImageList[2]" alt="">
            </div>
            <div class="box6-right">
                <div class="box6-right-textBox">
                    <div>
                        <div class="title">Congratulation!🎉</div>
                        <div class="text">You won the biggest extradiscount!</div>
                    </div>
                </div>
                <div>
                    <div class="box6-right-title">Debby, get your Tai Chi workout plan</div>
                    <!-- 商品1 -->
                    <div class="price1 priceItam" @click="priceClick = 0"
                        :class="priceClick == 0 ? 'blueBorder lightBlueBg' : ''">
                        <div class="priceItam-left">
                            <img v-if="priceClick != 0" src="../assets/image/suoerwall_bg2_0.png" alt="" srcset="">
                            <img v-if="priceClick == 0" src="../assets/image/suoerwall_bg2_1.png" alt="" srcset="">
                        </div>
                        <div class="priceItam-right">
                            <div class="priceItam-right-box1">
                                <div class="priceItam-right-text1" :class="priceClick == 0 ? 'blackColor' : ''">
                                    {{ productList[0]?.name || '1-WEEK TRIAL' }}
                                </div>
                                <div class="priceItam-right-text2">
                                    <span v-if="discount" class="line-through">
                                        {{ (productList[0]?.priceUnitAmount / 100).toFixed(2) || '4.99' }}
                                        {{ productList[0]?.priceCurrency || 'USD' }}
                                    </span>
                                    {{ discount ? (productList[0]?.priceDiscountUnitAmount / 100).toFixed(2) :
                                        (productList[0]?.priceUnitAmount / 100).toFixed(2) }}
                                    {{ productList[0]?.priceCurrency }}
                                </div>
                            </div>
                            <div class="priceItam-right-box2" :class="priceClick != 0 ? 'bg0' : 'bg1'">
                                <div class="priceItam-right-box2-text1" :class="priceClick == 0 ? 'blueColor' : ''">
                                    <span class="span1">$</span>
                                    <span class="span2">
                                        {{ discount ? (productList[0]?.priceDiscountUnitAmount / 100 / 7).toFixed(2) :
                                            (productList[0]?.priceUnitAmount / 100 / 7).toFixed(2) }}
                                    </span>
                                </div>
                                <div class="priceItam-right-box2-text2">per day</div>
                            </div>
                        </div>
                    </div>
                    <!-- 商品2 -->
                    <div class="price2" @click="priceClick = 1" :class="priceClick == 1 ? 'blueBorder' : ''">
                        <div class="price2-title" :class="priceClick == 1 ? 'whiteColor blueBg' : ''">MOST POPULAR</div>
                        <div class="priceItam" :class="priceClick == 1 ? 'lightBlueBg' : ''">
                            <div class="priceItam-left">
                                <img v-if="priceClick != 1" src="../assets/image/suoerwall_bg2_0.png" alt="" srcset="">
                                <img v-if="priceClick == 1" src="../assets/image/suoerwall_bg2_1.png" alt="" srcset="">
                            </div>
                            <div class="priceItam-right">
                                <div class="priceItam-right-box1">
                                    <div class="priceItam-right-text1" :class="priceClick == 1 ? 'blackColor' : ''">
                                        {{ productList[1]?.name || '1-WEEK TRIAL' }}
                                    </div>
                                    <div class="priceItam-right-text2">
                                        <span v-if="discount" class="line-through">
                                            {{ (productList[1]?.priceUnitAmount / 100).toFixed(2) || '39.99' }}
                                            {{ productList[1]?.priceCurrency || 'USD' }}
                                        </span>
                                        {{ discount ? (productList[1]?.priceDiscountUnitAmount / 100).toFixed(2) :
                                            (productList[1]?.priceUnitAmount / 100).toFixed(2) }}
                                        {{ productList[1]?.priceCurrency }}
                                    </div>
                                </div>
                                <div class="priceItam-right-box2" :class="priceClick != 1 ? 'bg0' : 'bg1'">
                                    <div class="priceItam-right-box2-text1" :class="priceClick == 1 ? 'blueColor' : ''">
                                        <span class="span1">$</span>
                                        <span class="span2">
                                            {{ discount ? (productList[1]?.priceDiscountUnitAmount / 100 / 7).toFixed(2)
                                                :
                                                (productList[1]?.priceUnitAmount / 100 / 7).toFixed(2) }}
                                        </span>
                                    </div>
                                    <div class="priceItam-right-box2-text2">per day</div>
                                </div>
                            </div>
                        </div>
                        <div class="price2-text" :class="priceClick == 1 ? 'blueTopBorder' : ''">🎁 Printable workouts
                            for
                            2026 included</div>
                    </div>
                    <!-- 商品三 -->
                    <div class="price3" @click="priceClick = 2" :class="priceClick == 2 ? 'blueBorder' : ''">
                        <div class="priceItam" :class="priceClick == 2 ? 'lightBlueBg' : ''">
                            <div class="priceItam-left">
                                <img v-if="priceClick != 2" src="../assets/image/suoerwall_bg2_0.png" alt="" srcset="">
                                <img v-if="priceClick == 2" src="../assets/image/suoerwall_bg2_1.png" alt="" srcset="">
                            </div>
                            <div class="priceItam-right">
                                <div class="priceItam-right-box1">
                                    <div class="priceItam-right-text1" :class="priceClick == 2 ? 'blackColor' : ''">
                                        {{ productList[2]?.name || '12-WEEK TRIAL' }}
                                    </div>
                                    <div class="priceItam-right-text2">
                                        <span v-if="discount" class="line-through">
                                            {{ (productList[2]?.priceUnitAmount / 100).toFixed(2) || '39.99' }}
                                            {{ productList[2]?.priceCurrency || 'USD' }}
                                        </span>
                                        {{ discount ? (productList[2]?.priceDiscountUnitAmount / 100).toFixed(2) :
                                            (productList[2]?.priceUnitAmount / 100).toFixed(2) }}
                                        {{ productList[2]?.priceCurrency }}
                                    </div>
                                </div>
                                <div class="priceItam-right-box2" :class="priceClick != 2 ? 'bg0' : 'bg1'">
                                    <div class="priceItam-right-box2-text1" :class="priceClick == 2 ? 'blueColor' : ''">
                                        <span class="span1">$</span>
                                        <span class="span2">
                                            {{ discount ? (productList[2]?.priceDiscountUnitAmount / 100 / 7).toFixed(2)
                                                :
                                                (productList[2]?.priceUnitAmount / 100 / 7).toFixed(2) }}
                                        </span>
                                    </div>
                                    <div class="priceItam-right-box2-text2">per day</div>
                                </div>
                            </div>
                        </div>
                        <div class="price2-text" :class="priceClick == 2 ? 'blueTopBorder' : ''">🎁 Printable workouts
                            for
                            2026 included</div>
                    </div>
                </div>
                <div class="price-button">
                    <div class="continue-btn" @click="goIt">
                        <div class="spacer"></div>
                        <div>Continue</div>
                        <img src="@/assets/continue-icon.webp">
                    </div>
                </div>
                <div class="price-right-text">
                    By continuing, you agree that your subscription will be auto-renewed at the ful price of 39.99 USD
                    each month at the end of the month intro period unless you cancel in
                    <span class="underline">Settings</span>
                    . Please see our
                    <span class="underline">Terms of Service,</span>
                    <span class="underline">Privacy Policy</span>
                </div>

            </div>
        </div>

    </div>
    <div class="mask" :class="isShow ? 'show' : ''">
        <div class="box">
            <div class="title">
                <span>Spin & win</span>
                <span class="blue">Your St. Patrick's Discount</span>
                <span> - up to - 62% off</span>
            </div>
            <div class="lottie-box">
                <div ref="lottieContainer" class="lottie1"></div>

            </div>
            <div class="text" v-if="discount">*The discount will be added automatically to the first billing period
            </div>
            <div @click="ButtonClick" class="button">
                {{ discount ? 'Get my discount' : 'Stop' }}
            </div>
            <div ref="lottieContainer1" class="lottie2"></div>
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

    .box6 {
        width: 100%;
        box-sizing: border-box;
        padding: 40px;
        background: #fff;
        border-radius: 8px;
        margin-top: 96px;
        display: flex;
        justify-content: space-between;

        .box6-left {
            width: 404px;

            .box6-left-title {
                text-align: center;
                font-family: Poppins;
                font-size: 16px;
                color: #242424;
                font-weight: 500;
            }

            .box6-left-ul {
                width: 100%;
                display: flex;
                justify-content: space-around;
                margin-top: 16px;

                .box6-left-li {
                    height: 28px;
                    box-sizing: border-box;
                    padding: 0 16px;
                    color: #959799;
                    text-align: center;
                    font-family: Poppins;
                    font-size: 14px;
                    font-weight: 500;
                    border-radius: 29px;
                    background: #F8F8F8;
                }
            }

            .box6-left-img {
                width: 100%;
                margin-top: 44px;
            }
        }

        .box6-right {
            width: 396px;

            .box6-right-textBox {
                width: 100%;
                height: 107px;
                background: url(@/assets/image/superwall_bg1.png) no-repeat;
                background-size: 100% 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;

                .title {
                    margin-top: 0px;
                    color: #D72211;
                    font-size: 24px;
                    font-weight: 700;
                    line-height: 36px;
                }

                .text {
                    color: #D72211;
                    font-family: Laien;
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 20px;
                }
            }

            .box6-right-title {
                color: #323233;
                font-family: Poppins;
                font-size: 28px;
                font-weight: 600;
                line-height: 42px;
                margin-top: 32px;
                text-align: left;
            }

            .priceItam {
                width: 100%;
                padding: 24px 20px;
                border-radius: 8px;
                box-sizing: border-box;
                border: 2px solid var(---OOG126-gray01, #EDF0F3);
                background: var(---OOG126-bg, #F8F8F8);
                display: flex;
                align-items: center;

                .priceItam-left {

                    margin-right: 12px;

                    img {
                        width: 32px;
                        height: 32px;
                    }
                }

                .priceItam-right {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;

                    .priceItam-right-text1 {
                        color: var(---OOG126-gray04, #959799);
                        text-align: left;
                        font-family: Poppins;
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 36px;
                    }

                    .priceItam-right-text2 {
                        color: #C7C9CC;
                        text-align: left;
                        font-family: Poppins;
                        font-size: 16px;
                        font-weight: 600;
                        line-height: 24px;

                        .line-through {
                            font-size: 14px;
                            font-weight: 500;
                            text-decoration: line-through;
                        }
                    }

                    .priceItam-right-box2 {
                        width: 124px;
                        height: 74px;
                        box-sizing: border-box;
                        padding-right: 12px;

                        .priceItam-right-box2-text1 {
                            text-align: right;
                            font-family: Poppins;
                            color: #959799;
                            margin-top: 9px;

                            .span1 {
                                font-size: 18px;
                                font-weight: 500;
                            }

                            .span2 {
                                font-size: 30px;
                                font-weight: 700;
                            }
                        }

                        .priceItam-right-box2-text2 {
                            color: var(---OOG126-gray03, #C7C9CC);
                            font-size: 12px;
                            font-weight: 600;
                            text-align: right;
                            line-height: 0;
                        }

                    }

                    .bg0 {
                        background: url(@/assets/image/suoerwall_bg3_0.png) no-repeat;
                        background-size: 100% 100%;
                    }

                    .bg1 {
                        background: url(@/assets/image/suoerwall_bg3_1.png) no-repeat;
                        background-size: 100% 100%;
                    }

                }
            }

            .price1 {
                margin-top: 24px;
            }

            .price2,
            .price3 {
                width: 100%;
                border-radius: 8px;
                border: 2px solid #EDF0F3;
                overflow: hidden;
                margin-top: 20px;

                .price2-title {
                    height: 32px;
                    background: #EDF0F3;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #959799;
                    font-family: Poppins;
                    font-size: 16px;
                    font-weight: 600;
                }

                .priceItam {
                    border: none;
                    border-radius: 0;
                }

                .price2-text {
                    box-sizing: border-box;
                    height: 32px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-top: 2px solid #EDF0F3;
                    font-family: Poppins;
                    font-size: 12px;
                    color: #C7C9CC;
                }
            }

            .blueBg {
                background: #2E73E0 !important;
            }

            .lightBlueBg {
                background: #F3F7FD !important;
            }

            .blueBorder {
                border: 2px solid #2E73E0 !important;
            }

            .blueTopBorder {
                border-top: 2px solid #2E73E0 !important;
            }

            .blueColor {
                color: #2E73E0 !important;
            }

            .whiteColor {
                color: #fff !important;
            }

            .blackColor {
                color: #000 !important;
            }

            .price-button {
                display: flex;
                width: 100%;
                margin-top: 24px;

                .continue-btn {
                    display: flex;
                    width: 100%;
                    height: 67px;
                    color: white;
                    font-weight: 600;
                    background-color: var(--style-color);
                    font-size: 18px;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 16px;
                    box-sizing: border-box;
                    cursor: pointer;
                    border-radius: 8px;

                    >.spacer,
                    img {
                        height: 24px;
                        width: 24px;
                    }
                }

                .continue-btn.disabled {
                    background-color: #C7C9CC;
                    cursor: not-allowed;
                    pointer-events: none;
                }
            }

            .price-right-text {
                margin-top: 12px;
                width: 100%;
                color: #969696;
                font-family: Poppins;
                font-size: 14px;
                font-weight: 400;
                text-align: left;
            }

            .underline {
                text-decoration-line: underline;
            }
        }
    }
}

.mask {
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.30);
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    opacity: 0.5;
    transition: all 0.3s ease;

    .box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        width: 544px;
        padding: 40px;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
        border-radius: 8px;
        border: 1.5px solid var(---OOG126-gray01, #EDF0F3);
        background: #FFF;

        .lottie2 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        .title {
            color: var(---OOG126-black, #242424);
            text-align: center;
            font-family: Poppins;
            font-size: 32px;
            font-weight: 700;
        }

        .blue {
            color: #2E73E0;
        }

        .lottie-box {
            width: 440px;
            height: 440px;
            position: relative;

            .lottie1 {
                width: 100%;
                height: 100%;
            }

        }

        .text {
            color: #959799;
            text-align: center;
            font-family: Poppins;
            font-size: 16px;
            font-weight: 500;
        }

        .button {
            width: 100%;
            border-radius: 8px;
            background: #2E73E0;
            padding: 22.5px 16px;
            text-align: center;
            color: #FFF;
            position: relative;
            z-index: 5;
        }
    }
}

.show {
    z-index: 999;
    opacity: 1;
}

@media (max-width: 767px) {}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {}
</style>