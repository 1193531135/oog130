<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay } from 'swiper/modules'
import 'swiper/css';
import { ref, onMounted, onUnmounted, computed } from 'vue'
import lottie from 'lottie-web'
import Select from './module/select.vue'
import { PushControl } from '@/tool/index.js'
import { PageData, BMI } from "@/tool/index.js";
import { useRoute } from 'vue-router'
import { getPriceList } from '@/api/system/index.js'
import animationData from '../assets/json/superwall_lottie1.json'
import animationData1 from '../assets/json/superwall_lottie2.json'
import { Mixpanel } from "@/config/mixpanel.js"

const images = import.meta.glob('@/assets/image/*', { eager: true })
// 预加载图片
Object.values(images).forEach((src) => {
    const img = new Image()
    img.src = src.default
})

const pushControl = new PushControl()
const mixpanel = new Mixpanel();

const uid = sessionStorage.getItem("uid");
const route = useRoute()
const pageText = window.languageData[route.name]
const pageData = new PageData()
const male = pageData["ChooserGender"] || 0
const bgImageList = [
    images[`/src/assets/image/superwall_img1_${male}.png`]?.default,
    images[`/src/assets/image/superwall_img2_${male}.png`]?.default,
    images[`/src/assets/image/superwall_img5_${male}.png`]?.default,
    images[`/src/assets/image/superwall_img2-390_${male}.png`]?.default,
]


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
//变量数据
const userData = ref({})
//控制按钮
const isDisabled = ref(false)

const nowBMI = BMI({
    height: pageData['YourHeight'].value,
    weight: pageData['CurrentWeight'].value,
    isFt: pageData['YourHeight']?.unit === "ft/in",
    isLb: pageData['CurrentWeight']?.unit === "lb"
}).toFixed(2)
const targetBMI = BMI({
    height: pageData['YourHeight'].value,
    weight: pageData['TargetWeight'].value,
    isFt: pageData['YourHeight']?.unit === "ft/in",
    isLb: pageData['TargetWeight']?.unit === "lb"
}).toFixed(2)
let promptNum = ref(0)
if (nowBMI < 18) {
    promptNum.value = 0
} else if (nowBMI >= 19 && nowBMI < 25) {
    promptNum.value = 1
} else if (nowBMI >= 26 && nowBMI < 35) {
    promptNum.value = 2
} else {
    promptNum.value = 3
}
console.log('promptNum',promptNum.value,pageText.promptNum)
userData.value.age = calcAge(pageData['DateOfBirth'])
userData.value.gender = pageData['ChooserGender']
const currentKcal = calcRecommendedCalories(pageData['CurrentWeight'], pageData['YourHeight'])
console.log('YourHeight', pageData['YourHeight'])

if (pageData['YourHeight']?.unit == "ft/in") { }
// if(pageData['YourHeight'])
// bmi = BMI()
// console.log(bmi)
// 计算进度百分比
const fillPercent = computed(() => {
    const pct = ((currentKcal - 1000) / (5000 - 1000)) * 100
    return Math.max(0, Math.min(100, pct))
})
const calcBodyFat = (bmi, gender, age) =>
    Number((gender === 0
        ? 1.2 * bmi + 0.23 * age - 16.2
        : 1.2 * bmi + 0.23 * age - 5.4
    ).toFixed(2));
console.log(1111, userData.value, currentKcal, fillPercent)

// 设置mixpanel配置项
/*
design_id：paywall-page页面id，命名规则  Web-Paywall-(随机8位数字字母)；工具地址：https://tool.ip138.com/uuid/（取-前8位）
*/
const design_id = ""
const product_id = computed(() => productList.value[priceClick.value]?.id || '')
const mixpanelConfig = () => {
    return {
        design_id,
        product_id: product_id.value,
        paywall_source: "onboarding",
        paywall_type: "onboarding",
    }
}
const mixpanelConfigOB = () => {
    return {
        design_id,
        product_id: product_id.value,
    }
}
const eventTracker = {
    // 初始化触发
    view() {
        mixpanel.setmMxpanelValue("OB Paywall Viewed Web", mixpanelConfigOB())
        mixpanel.setmMxpanelValue("Paywall Viewed Web", mixpanelConfig())
    },
    // 点击支付触发
    clickPay() {
        mixpanel.setmMxpanelValue("OB Paywall Continued Web", mixpanelConfigOB())
        mixpanel.setmMxpanelValue("Paywall Continued Web", mixpanelConfig())
    },
    // 免费试用支付成功触发
    payFree() {
        mixpanel.setmMxpanelValue("OB Paywall Trialed Web", mixpanelConfigOB())
        mixpanel.setmMxpanelValue("Paywall Trialed Web", mixpanelConfig())
    },
    // 正常付费成功触发
    paySuccess() {
        mixpanel.setmMxpanelValue("OB Paywall Purchased Web", mixpanelConfigOB())
        mixpanel.setmMxpanelValue("Paywall Purchased Web", mixpanelConfig())
    }
}

getPriceList(uid, { uid, lpId: '' }).then(res => {
    productList.value = res.data.products
    console.log('products', res.data.products)
    // 进入页面触发加载埋点，因为要传入价格，所以放在获取价格列表之后
    eventTracker.view()
})

//BMI计算
// 基础数据

// BMI 区间范围（可按需修改）
const MIN_BMI = 18
const MAX_BMI = 36

// 计算滑块百分比位置
const thumbPosition = computed(() => {
    const percent = ((nowBMI - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100
    // 限制滑块不超出轨道边界
    return Math.max(0, Math.min(100, percent))
})

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
    anim1.addEventListener("complete", () => {
        isDisabled.value = false
    })
    setTimeout(() => {
        console.log('显示抽奖弹窗')
        isShow.value = true
        isDisabled.value = false
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
        isDisabled.value = true
        anim.goToAndStop(300, true)
        anim?.play()
    }
}
// swiper
// 注册需要的模块
const swiperModules = [Autoplay]

// 1:1还原截图里的评价数据
const reviewList = [
    {
        name: 'Andrew',
        content: `As someone who's not a fitness pro, the customized workout plan in this app is a lifesaver. It caters to my specific needs and fitness level. It's not one-size-fits-all, and that's what makes it stand out.`
    },
    {
        name: 'Richard',
        content: `I'm loving the customized workouts this app offers. It's like having a tailor-made fitness program in my pocket. It takes my preferences and fitness level into account, making it super effective and enjoyable!`
    },
    {
        name: 'Matthew',
        content: `I was skeptical at first, but this app surprised me. The workouts are decent, and I appreciate the progress tracking. A good option for those who can't make it to the gym.`
    },
    {
        name: 'Michael',
        content: `I'm not fitness pro, but this app easy for anyone to get in shape, instructional videos are clear, enjoying my daily workouts. T up!`
    },
    {
        name: '匿名用户',
        content: `so good! The personalized plan it provided was spot on. It having a personal trainer who exactly what I need. I'm already progress after just a few weeks!`
    }
]

// 响应式适配配置
const responsiveConfig = {
    0: { slidesPerView: 1, spaceBetween: 16 },   // 手机：1张
    768: { slidesPerView: 2, spaceBetween: 20 }, // 平板：2张
    1200: { slidesPerView: 4, spaceBetween: 24 } // 电脑：3张
}
//年龄计算
function calcAge(birthDayStr) {
    const [day, month, year] = birthDayStr.split('/')
    const birth = new Date(year, month - 1, day)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) {
        age--
    }
    return age
}
//卡路里计算
function calcRecommendedCalories(weightObj, heightObj) {
    // 体重转换：lb → kg
    const weight = weightObj.unit === 'lb'
        ? Number(weightObj.value) * 0.453592
        : Number(weightObj.value);

    // 身高转换：ft/in 字符串 → cm（规则：123 = 1ft 23in）
    let height;
    if (heightObj.unit === 'ft/in') {
        const hStr = String(heightObj.value);
        const ft = Number(hStr[0]);
        const inch = Number(hStr.slice(1));
        height = ft * 30.48 + inch * 2.54;
    } else {
        height = Number(heightObj.value);
    }
    console.log(weight, height, 55555)
    // 卡路里计算公式
    const recommendedCalories = ((10 * weight + 6.25 * height - 300) * 1.2) - 300;
    return Math.round(recommendedCalories);
}

// change
function change(val) {
    priceClick.value = val;
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
                            <div class="text2">
                                {{ Math.floor(calcBodyFat(nowBMI, userData.gender, userData.age) / 4) * 4 }}%
                                -
                                {{ Math.floor(calcBodyFat(nowBMI, userData.gender, userData.age) / 4) * 4 + 4 }}%
                            </div>
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
                    <div class="box1-itam-title">Your Goal</div>
                    <div class="box1-itam-content">
                        <div class="textBox1">
                            <div class="text1">Body fat</div>
                            <div class="text2">
                                {{ Math.floor(calcBodyFat(targetBMI, userData.gender, userData.age) / 4) * 4 }}%
                                -
                                {{ Math.floor(calcBodyFat(targetBMI, userData.gender, userData.age) / 4) * 4 + 4 }}%
                            </div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Energy Level</div>
                            <div class="bar-ul">
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                            </div>
                        </div>
                        <div class="textBox2">
                            <div class="text1">Tai Chi level</div>
                            <div class="bar-ul">
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
                                <div class="bar-li blue"></div>
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
            <div class="box2-bml">
                <!-- BMI 数值标题 -->
                <div class="bmi-header">
                    <p class="label">Current BMI</p>
                    <div class="value-row">
                        <p class="bmi-value">{{ nowBMI }} BMI</p>
                        <p class="normal-mark">{{ pageText.promptNum[promptNum]?.title }} <span class="diff">-{{ nowBMI
                                }}</span></p>
                    </div>
                </div>

                <!-- 彩色进度条轨道 + 滑块 -->
                <div class="slider-wrapper">
                    <div class="slider-track"></div>
                    <div class="slider-thumb" :style="{ left: thumbPosition + '%' }"></div>
                </div>

                <!-- 左右两端标签 -->
                <div class="scale-labels">
                    <span>Underweight</span>
                    <span>Obese</span>
                </div>

                <!-- 底部状态说明卡片 -->
                <div class="status-card">
                    <h2 class="status-title" :style="'color:' + pageText.promptNum[promptNum]?.color + ';'">{{
                        pageText.promptNum[promptNum]?.title }}</h2>
                    <p class="status-desc">
                        <span>{{ pageText.promptNum[promptNum]?.text[0] }}</span>
                        <span>({{ nowBMI }})</span>
                        <span>{{ pageText.promptNum[promptNum]?.text[1] }}</span>
                    </p>
                </div>

            </div>
            <div class="box2-bottom">
                <div class="box2-bottom-left">
                    <div class="recommend-tag">Recommended</div>
                    <div class="card-header">
                        <div class="icon-box">🍔</div>
                        <div class="text-group">
                            <p class="label">Daily calorie intake</p>
                            <p class="value">{{ currentKcal }}kcal</p>
                        </div>
                    </div>
                    <!-- 卡路里进度条 -->
                    <div class="slider-area">
                        <div class="slider-track">
                            <div class="slider-fill" :style="{ width: fillPercent + '%' }"></div>
                            <div class="slider-thumb" :style="{ left: fillPercent + '%' }"></div>
                        </div>
                        <div class="scale">
                            <span>1000 Kcal</span>
                            <span>5000 Kcal</span>
                        </div>
                    </div>
                </div>
                <div class="box2-bottom-right">
                    <div class="recommend-tag">Recommended</div>
                    <div class="card-header">
                        <div class="icon-box">💦</div>
                        <div class="text-group">
                            <p class="label">Daily water intake</p>
                            <p class="value">1.8 L</p>
                        </div>
                    </div>
                    <div class="cupBox">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_1.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_0.png">
                        <img class="cup" src="../assets/image/suoerwall_bg4_0.png">
                    </div>

                </div>
            </div>
        </div>
        <div class="box3">
            <div class="title">What you get</div>
            <div class="box3-ul">
                <div class="box3-li">
                    <img class="box3-li-icon" src="../assets/image/suoerwall_icon_1.png" alt="">
                    <div class="text-group">
                        <p class="label">Tai Chi program</p>
                        <p class="value">tailored to your age, body type, and wellness goals.</p>
                    </div>
                </div>
                <div class="box3-li">
                    <img class="box3-li-icon" src="../assets/image/suoerwall_icon_2.png" alt="">
                    <div class="text-group">
                        <p class="label">Beginner-friendly, no-equipment routines</p>
                        <p class="value">designed to build muscle and shed weight.</p>
                    </div>
                </div>
                <div class="box3-li">
                    <img class="box3-li-icon" src="../assets/image/suoerwall_icon_3.png" alt="">
                    <div class="text-group">
                        <p class="label">Step-by-step</p>
                        <p class="value">to heal your body, improve mobility, and lose weight.</p>
                    </div>
                </div>
            </div>
            <img class="box3-img" :src="bgImageList[1]" alt="">
            <img class="box3-img390" :src="bgImageList[3]" alt="">
        </div>
        <div class="box4">
            <img class="box4-img" src="../assets/image/superwall_img3.png">
            <img class="box4-img-390" src="../assets/image/superwall_img3_390.png">
            <div class="main">
                <img class="main-img" src="../assets/image/superwall_img4_390.png">
                <div class="main-title">Printable plan for 2026</div>
                <div class="main-text">Get a printable bonus in addition to the main program</div>
            </div>
        </div>
        <div class="box5">
            <div class="box5-top">
                <div class="box5-title">Goals for your program also include:</div>
                <div class="box5-ul">
                    <div class="box5-li">
                        <img class="box5-li-icon" src="../assets/image/suoerwall_icon1.png" alt="">
                        <span>Reduce stress</span>
                    </div>
                    <div class="box5-li">
                        <img class="box5-li-icon" src="../assets/image/suoerwall_icon1.png" alt="">
                        <span>Self-discipline</span>
                    </div>
                    <div class="box5-li">
                        <img class="box5-li-icon" src="../assets/image/suoerwall_icon1.png" alt="">
                        <span>Improve sleep</span>
                    </div>
                    <div class="box5-li">
                        <img class="box5-li-icon" src="../assets/image/suoerwall_icon1.png" alt="">
                        <span>Feel healthier</span>
                    </div>
                    <div class="box5-li">
                        <img class="box5-li-icon" src="../assets/image/suoerwall_icon1.png" alt="">
                        <span>Form a physical habit</span>
                    </div>
                </div>
            </div>
            <div class="box5-center">
                <div class="box5-center-box1">
                    <img src="../assets/image/suoerwall_icon2_0.png" alt="">
                    <div class="box5-textBox">
                        <p class="box5-title">15+ Million</p>
                        <p class="box5-text">started their fitness journey
                            with us</p>
                    </div>
                    <img src="../assets/image/suoerwall_icon2_1.png" alt="">
                </div>
                <div class="box5-center-box2">
                    <img v-for="item in [1, 2, 3, 4, 5]" src="../assets/image/suoerwall_icon3.png" alt="">
                </div>
                <div class="box5-center-box3 ">Over 300 000 5-star ratings from happy users</div>
            </div>
            <div class="box5-bottom">
                <div class="box5-title">Full workout plan</div>
                <div class="box5-ul">
                    <div class="box5-li">
                        <img src="../assets/image/suoerwall_icon4.png" alt="" srcset="">
                        <span>Build a habit and develop the correct exercising techniques</span>
                    </div>
                    <div class="box5-li">
                        <img src="../assets/image/suoerwall_icon4.png" alt="" srcset="">
                        <span>Lose excessive body fat & improve workout intensity</span>
                    </div>
                    <div class="box5-li">
                        <img src="../assets/image/suoerwall_icon4.png" alt="" srcset="">
                        <span>Achieve your goal and change your life forever</span>
                    </div>
                </div>
            </div>

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
                    <div class="price1 priceItam" @click="change(0)"
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
                                        {{ discount ? (productList[0]?.priceDiscountUnitAmount / 100 / 7
                                            * productList[0]?.intervalCount).toFixed(2) :
                                            (productList[0]?.priceUnitAmount / 100 / 7
                                                * productList[0]?.intervalCount).toFixed(2) }}
                                    </span>
                                </div>
                                <div class="priceItam-right-box2-text2">per day</div>
                            </div>
                        </div>
                    </div>
                    <!-- 商品2 -->
                    <div class="price2" @click="change(1)" :class="priceClick == 1 ? 'blueBorder' : ''">
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
                                            {{ discount ? (productList[1]?.priceDiscountUnitAmount / 100 /
                                                7 * productList[0]?.intervalCount).toFixed(2)
                                                :
                                                (productList[1]?.priceUnitAmount / 100 /
                                                    7 * productList[0]?.intervalCount).toFixed(2) }}
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
                    <div class="price3" @click="change(2)" :class="priceClick == 2 ? 'blueBorder' : ''">
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
                                            {{ discount ? (productList[2]?.priceDiscountUnitAmount / 100 /
                                                7 * productList[0]?.intervalCount).toFixed(2)
                                                :
                                                (productList[2]?.priceUnitAmount / 100 /
                                                    7 * productList[0]?.intervalCount).toFixed(2) }}
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
        <div class="box7">
            <div class="box7-cont">
                <div class="box7-textBox">
                    <div class="box7-title">
                        Money-Back Guarantee
                    </div>
                    <div class="box7-text">
                        <p>We believe that our plan may work for you and you'll get visible results in 4 weeks! We are
                            even
                            ready to completely refund you within 30 days after purchase if you don't get visible
                            results
                            and can demonstrate that you have followed our plan. </p>
                        <p>Find out more about the applicable limitations in our <span>money-back policy</span></p>
                    </div>
                </div>
                <img class="box7-img" src="../assets/image/superwall_img6.png" alt="" srcset="">
            </div>
        </div>
        <div class="box8">
            <p class="box8-title1">We helped over</p>
            <p class="box8-title2">75000 people</p>
            <p class="box8-title3">to achieve their dream physique</p>
            <div class="box8-swiper">
                <Swiper :modules="swiperModules" :slidesPerView="4" :spaceBetween="24" :loop="true"
                    :breakpoints="responsiveConfig" class="review-swiper">
                    <SwiperSlide v-for="(item, index) in reviewList" :key="index">
                        <!-- 单条评价卡片 -->
                        <div class="review-card">
                            <div class="review-card-box">
                                <!-- 用户头像+昵称 -->
                                <div class="user-header">
                                    <img class="avatar" src="../assets/image/suoerwall_icon5.png" alt="" srcset="">
                                    <span class="user-name">{{ item.name }}</span>
                                </div>
                                <!-- 五星评分 -->
                                <div class="stars">
                                    <img v-for="value in [1, 2, 3, 4, 5]" src="../assets/image/suoerwall_icon6.png"
                                        alt="" srcset="">
                                </div>
                            </div>
                            <!-- 评价正文 -->
                            <p class="review-text">{{ item.content }}</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <p class="box8-text">Testimonials are sourced from Google Play. Photos are forillustrative purposes only</p>
        </div>
        <div class="bottom">
            <p class="bottom-title1">Follow us</p>
            <p class="bottom-title2">to skyrocket your result!</p>
            <div class="bottom-imgBox">
                <img style="margin-right: 32px;" src="../assets/image/superwall_img7_0.png" alt="" srcset="">
                <img src="../assets/image/superwall_img7_1.png" alt="" srcset="">
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
            <div @click="ButtonClick" class="button" :class="{ 'disabled': isDisabled }">
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
        margin-top: 32px;

        .box2-bml {
            width: 100%;
            padding: 40px 56px;
            border-radius: 8px;
            background: #fff;
            box-sizing: border-box;

            .bmi-header .label {
                text-align: left;
                font-family: Poppins;
                font-size: 16px;
                color: #959799;
                font-weight: 500;
            }

            .value-row {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }

            .bmi-value {
                font-family: Poppins;
                font-size: 32px;
                font-weight: 600;
                color: #242424;
            }

            .normal-mark {
                font-family: Poppins;
                font-size: 15px;
                font-weight: 500;
                color: #242424;
            }

            .normal-mark span {
                color: #1677ff;
            }

            /* 彩色渐变轨道 */
            .slider-wrapper {
                position: relative;
                height: 12px;
                margin: 40px 0 16px;
            }

            .slider-track {
                width: 100%;
                height: 100%;
                border-radius: 12px;
                background: linear-gradient(90deg,
                        #409eff 0%,
                        #36d399 30%,
                        #51e85b 45%,
                        #f9a826 70%,
                        #ff5549 100%);
            }

            /* 滑块 */
            .slider-thumb {
                position: absolute;
                top: 50%;
                width: 32px;
                height: 32px;
                transform: translate(-50%, -50%);
                background: rgba(100, 180, 255, 0.3);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .slider-thumb::after {
                content: '';
                width: 20px;
                height: 20px;
                background: #2563eb;
                border-radius: 50%;
                border: 3px solid #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                box-sizing: border-box;
            }

            /* 刻度文字 */
            .scale-labels {
                display: flex;
                justify-content: space-between;
                font-family: Poppins;
                font-size: 14px;
                font-weight: 500;
                color: #959799;
                margin-bottom: 14px;
            }

            /* 底部状态卡片 */
            .status-card {
                background: #f8f8f8;
                padding: 16px;
                border-radius: 8px;
                text-align: left;
            }

            .status-title {
                color: #1CB647;
                font-family: Poppins;
                font-size: 18px;
                font-weight: 600;
            }

            .status-desc {
                color: #959799;
                font-family: Poppins;
                font-size: 16px;
                font-weight: 500;
            }
        }

        .box2-bottom {
            width: 100%;
            margin-top: 24px;

            .box2-bottom-left,
            .box2-bottom-right {
                position: relative;
                float: left;
                width: 448px;
                height: 236px;
                box-sizing: border-box;
                padding: 40px 56px;
                background: #fff;
                font-family: Poppins;
                border-radius: 8px;

                .cupBox {
                    width: 100%;
                    display: flex;
                    margin-top: 24px;
                    justify-content: space-between;

                    img {
                        width: 33.25px;
                    }
                }
            }

            .box2-bottom-right {
                float: right;
            }

            .card-header {
                display: flex;
                position: relative;
            }

            .icon-box {
                width: 68px;
                height: 68px;
                background: #F8F8F8;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 40px;
                margin-right: 24px;
            }

            .text-group {
                // width: 100%;
                text-align: left;
            }

            .text-group .label {
                font-size: 16px;
                color: #959799;
                font-weight: 500;

            }

            .text-group .value {
                font-size: 32px;
                font-weight: 600;
                color: #242424;
            }

            .recommend-tag {
                position: absolute;
                top: 0px;
                right: 0;
                border-radius: 0 8px;
                background: rgba(255, 73, 73, 0.08);
                color: #FF4949;
                padding: 8px 12px;
                font-size: 14px;
                font-weight: 500;
                box-sizing: border-box;
            }

            /* 卡路里滑块样式 */
            .slider-area {
                width: 100%;
                margin-top: 34px;
            }

            .slider-track {
                width: 100%;
                height: 12px;
                background: linear-gradient(90deg, #FFE8E8 0%, #FF4949 100%);
                border-radius: 12px;
                position: relative;
            }

            .slider-fill {
                height: 100%;
                // background: #ff4d4d;
                border-radius: 12px;
            }

            .slider-thumb {
                position: absolute;
                top: 50%;
                width: 32px;
                height: 32px;
                background: #ff4444;
                border: 6px solid #fff;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                // box-shadow: 0 2px 10px rgba(255, 70, 70, 0.3);
                box-sizing: border-box;
            }

            .scale {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                color: #959799;
                font-weight: 500;
                margin-top: 14px;
            }

            /* 水杯样式 */
            .water-glasses {
                display: flex;
                justify-content: space-between;
                gap: 12px;
            }

            .glass-item {
                width: 70px;
                height: 130px;
                border: 2px solid #ddd;
                border-radius: 0 0 24px 24px;
                background: #ffffff;
                position: relative;
                overflow: hidden;
            }

            .glass-item.filled::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 90%;
                background: linear-gradient(to top, #40a9ff 0%, #b8e1ff 100%);
                border-radius: 0 0 22px 22px;
            }
        }
    }

    .box3 {
        width: 100%;
        font-family: Poppins;
        text-align: left;
        margin-top: 96px;

        .title {
            font-size: 28px;
            font-weight: 600;
            color: #323233;
            text-align: left;
            margin-bottom: 28px;
        }

        .box3-ul {
            width: 100%;

            .box3-li {
                display: flex;
                align-items: center;
                margin-bottom: 24px;

                .box3-li-icon {
                    width: 68px;
                    height: 68px;
                    margin-right: 16px;
                }

                .text-group {
                    text-align: left;

                    .label {
                        margin-top: 0;
                        font-size: 20px;
                        font-weight: 600;
                        color: #242424;
                    }

                    .value {
                        font-size: 16px;
                        font-weight: 500;
                        color: #959799;
                    }
                }
            }
        }

        .box3-img {
            width: 100%;
            margin-top: -280px;
        }

        .box3-img390 {
            display: none;
            width: 100%;
        }
    }

    .box4 {
        margin-top: 113px;
        width: 100%;
        position: relative;

        .box4-img {
            width: 100%;
        }

        .box4-img-390 {
            width: 100%;
            display: none;
        }

        .main {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            font-family: Poppins;
            text-align: center;

            .main-img {
                width: 138px;
                margin: 0 auto;
            }

            .main-title {
                margin-top: 24px;
                font-size: 40px;
                font-weight: 600;
                color: #242424;
            }

            .main-text {
                margin-top: 12px;
                font-size: 18px;
                font-weight: 500;
                color: #959799;
            }

        }
    }

    .box5 {
        width: 100%;
        margin-top: 64px;

        .box5-top {
            font-family: Poppins;
            color: #242424;
            text-align: left;

            .box5-title {
                font-size: 28px;
                font-weight: 600;
            }

            .box5-ul {
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin-top: 28px;
                flex-wrap: wrap;

                .box5-li {
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    font-weight: 600;

                    img {
                        width: 32px;
                        height: 32px;
                        margin-right: 16px;
                    }

                    span {
                        width: 240px;
                    }
                }
            }

        }

        .box5-center {
            margin-top: 110px;
            width: 100%;
            text-align: center;
            font-family: Poppins;

            .box5-center-box1 {
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    height: 191px;
                }

                .box5-textBox {
                    .box5-title {
                        font-size: 48px;
                        font-weight: 600;
                        color: #242424;
                    }

                    .box5-text {
                        margin-top: 8px;
                        font-size: 20px;
                        font-weight: 500;
                        color: #959799;
                    }
                }
            }

            .box5-center-box2 {
                margin-top: 20px;

                img {
                    width: 35px;
                    height: 35px;
                    margin: 0 2px;
                }
            }

            .box5-center-box3 {
                margin-top: 20px;
                font-size: 24px;
                font-weight: 500;
            }

        }

        .box5-bottom {
            width: 100%;
            margin-top: 110px;
            font-family: Poppins;
            color: #323233;

            .box5-title {
                font-size: 40px;
                font-weight: 600;
                text-align: center;
            }

            .box5-ul {
                margin: 0 auto;
                width: 658px;
                margin-top: 32px;
                display: flex;
                flex-wrap: wrap;

                .box5-li {
                    display: flex;
                    align-items: left;
                    font-size: 20px;
                    font-weight: 500;
                    margin-bottom: 14px;

                    img {
                        width: 32px;
                        height: 32px;
                        margin-right: 16px;
                    }
                }
            }
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

    .box7 {
        width: 100%;
        margin-top: 96px;

        .box7-cont {
            width: 100%;
            padding: 47px 68px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 8px;
            background: #FFF;
            font-family: Poppins;
            text-align: left;
            box-sizing: border-box;

        }

        .box7-textBox {
            width: 545px;
        }

        .box7-title {
            font-size: 28px;
            font-weight: 600;
            color: #242424;
        }

        .box7-text {
            font-size: 16px;
            font-weight: 400;
            color: #959799;

            span {
                color: #2E73E0;
            }
        }

        .box7-img {
            width: 200px;
            height: 200px;
        }
    }

    .box8 {
        width: 100vw;
        text-align: center;
        font-family: Poppins;
        margin-top: 96px;

        .box8-title1 {
            font-size: 24px;
            font-weight: 500;
            color: #242424;
        }

        .box8-title2 {
            margin-top: 8px;
            font-size: 40px;
            font-weight: 600;
            color: #242424;
        }

        .box8-title3 {
            margin-top: 12px;
            font-size: 20px;
            font-weight: 500;
            color: #959799;
        }

        .box8-swiper {
            margin-top: 32px;
            width: 100%;
            box-sizing: border-box;
            font-family: Poppins;
            text-align: left;

            .review-swiper {
                width: 100%;
                margin: 0 auto;
            }

            .review-card {
                background: #ffffff;
                padding: 16px;
                height: 189px;
                box-sizing: border-box;

                .review-card-box {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
            }

            .user-header {
                display: flex;
                align-items: center;
            }

            .avatar {
                width: 24px;
                height: 24px;
                margin-right: 8px;
            }

            .user-name {
                font-size: 16px;
                font-weight: 500;
                color: #242424;
            }

            .stars {
                display: flex;

                img {
                    width: 20px;
                    height: 20px;
                }
            }

            .review-text {
                margin-top: 8px;
                font-size: 14px;
                line-height: 20.8px;
                color: #959799;
                font-weight: 400;

            }
        }

        .box8-text {
            margin-top: 16px;
            font-size: 16px;
            font-weight: 400;
            color: #959799;
        }
    }

    .bottom {
        margin-top: 96px;
        margin-bottom: 200px;
        width: 100%;
        color: #242424;
        font-family: Poppins;
        text-align: center;

        .bottom-title1 {
            font-size: 32px;
            font-weight: 600;
        }

        .bottom-title2 {
            font-size: 18px;
            font-family: Laien;
            font-weight: 500;
        }

        .bottom-imgBox {
            margin-top: 40px;
            display: flex;
            justify-content: center;

            img {
                width: 56px;
                height: 56px;
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
    display: flex;
    align-items: center;
    justify-content: center;

    .box {
        position: relative;
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

        .button.disabled {
            background-color: #C7C9CC;
            cursor: not-allowed;
            pointer-events: none;
        }
    }
}

.show {
    z-index: 999;
    opacity: 1;
}

@media (max-width: 768px) {
    .mask {
        padding: 0 16px;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;

        .box {
            box-sizing: border-box;
            display: block;
            width: 100%;
            padding: 16px;

            .title {
                font-size: 24px;
            }

            .lottie-box {
                width: 100%;
                height: auto;
            }

            .text {
                font-size: 14px;
            }

            .button {
                margin-top: 12px;
                box-sizing: border-box;
            }

        }
    }

    .text-page {
        width: 100%;

        .box1 {
            .box1-content {
                height: auto;

                .box1-itam {
                    .box1-itam-content {
                        box-sizing: border-box;
                        padding: 24px 0 24px 24px !important;

                        .textBox1 {
                            margin-top: 0;

                            .text2 {
                                font-size: 18px;
                            }
                        }

                        .textBox2 {
                            .bar-ul {
                                width: 151px;

                                .bar-li {
                                    width: 27px;
                                }
                            }
                        }
                    }
                }
            }

        }

        .text {
            padding: 0 16px;
            box-sizing: border-box;
            font-size: 13px;
        }

        .title {
            padding: 0 16px;
            box-sizing: border-box;
            margin-top: 26px;
            font-size: 24px;
            line-height: 36px;
        }

        .box2 {
            margin-top: 16px;
            box-sizing: border-box;
            padding: 0 16px;

            .box2-bml {
                padding: 16px;

                .bmi-header {
                    .value-row {
                        .bmi-value {
                            font-size: 24px;
                        }
                    }


                }

                .slider-wrapper {
                    .slider-track {
                        background: linear-gradient(90deg,
                                #409eff 0%,
                                #36d399 20%,
                                #51e85b 35%,
                                #f9a826 60%,
                                #ff5549 100%) !important;
                    }
                }
            }

            .box2-bottom {
                .box2-bottom-left {
                    padding: 16px;
                    padding-top: 40px;

                    .card-header {

                        .text-group {
                            .value {
                                font-size: 24px;
                            }
                        }
                    }
                }

                .box2-bottom-right {
                    padding: 16px;
                    padding-top: 40px;
                }
            }

            .box2-bottom-left {
                width: 100% !important;
            }

            .box2-bottom-right {
                margin-top: 12px;
                width: 100% !important;
            }
        }

        .box3 {
            margin-top: 36px;

            .title {
                margin-top: 0;
                margin-bottom: 16px;
            }

            .box3-ul {
                .box3-li {
                    align-items: flex-start;

                    .box3-li-icon {
                        width: 52px;
                        height: 52px;
                    }

                    .text-group {
                        .label {
                            font-size: 16px;
                        }

                        .value {
                            font-size: 14px;
                        }
                    }
                }
            }
        }


        .box3 {
            box-sizing: border-box;
            padding: 0 16px;

            .box3-img {
                display: none;
            }

            .box3-img390 {
                display: block;
            }
        }

        .box4 {
            margin-top: 40px;
            padding: 0 16px;
            box-sizing: border-box;

            .box4-img {
                display: none;
            }

            .box4-img-390 {
                display: block;
            }

            .main {
                padding: 0 16px;
                box-sizing: border-box;

                .main-img {
                    width: 104px;
                }

                .main-title {
                    font-size: 24px;
                    margin-top: 10px;
                }
            }
        }

        .box5 {
            margin-top: 36px;
            padding: 0 16px;
            box-sizing: border-box;

            .box5-top {
                .box5-title {
                    font-size: 20px;
                }

                .box5-ul {
                    margin-top: 16px;

                    .box5-li {
                        width: 165px;
                        font-size: 16px;
                        margin-bottom: 12px;

                        .box5-li-icon {
                            width: 24px;
                            height: 24px;
                        }
                    }

                    .box5-li:last-child {
                        width: 100%;
                    }
                }
            }

            .box5-center {
                margin-top: 52px;

                .box5-center-box1 {
                    img {
                        height: 129px;
                    }

                    .box5-textBox {
                        .box5-title {
                            font-size: 32px;
                        }
                    }
                }

                .box5-center-box3 {
                    font-size: 16px;
                }
            }

            .box5-bottom {
                margin-top: 52px;
                width: 100%;

                .box5-title {
                    font-size: 24px;
                }

                .box5-ul {
                    width: 100%;

                    .box5-li {
                        align-items: center;
                        font-size: 16px;
                        text-align: left;

                        img {
                            margin-right: 8px;
                        }
                    }
                }
            }
        }

        .box6 {
            display: block;
            margin-top: 52px;
            padding: 16px;

            .box6-left {
                width: 100%;

                .box6-left-ul {
                    .box6-left-li {
                        font-size: 13px;
                    }
                }

                .box6-left-img {
                    width: 240px;
                }
            }

            .box6-right {
                margin-top: 24px;
                width: 100%;

                .box6-right-title {
                    margin-top: 24px;
                    font-size: 20px;
                }

                .priceItam {
                    padding: ;

                    .priceItam-left {}

                    .priceItam-right {
                        .priceItam-right-box1 {
                            .priceItam-right-text1 {
                                font-size: 18px;
                            }

                        }

                        .priceItam-right-text2 {
                            font-size: 16px;

                            .line-through {
                                font-size: 16px;
                            }
                        }

                        .priceItam-right-box2 {
                            width: 106px;
                            height: 58px;

                            .priceItam-right-box2-text1 {
                                margin-top: 0;
                            }
                        }
                    }
                }
            }
        }

        .box7 {
            width: 100vw;
            box-sizing: border-box;
            margin-top: 36px;
            padding: 0 16px;

            .box7-cont {
                width: 100%;
                padding: 16px;
                display: block;

                .box7-textBox {
                    width: 100%;
                }

                .box7-img {
                    margin-top: 16px;
                    width: 120px;
                    height: 120px;
                    margin-left: calc(100% - 120px);
                }

            }
        }

        .box8 {
            padding: 16px;
            box-sizing: border-box;
        }
    }
}

/* 0-500px 小屏手机 */
@media (max-width: 500px) {}
</style>