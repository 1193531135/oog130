import queryString from 'querystring';
import { router,registerList } from "@/router/index.js";
import { Mixpanel } from "@/config/mixpanel.js"

const mixpanel = new Mixpanel()
export function readLanguage() {
  const lang = queryString.parse(window.location.search).lang || "en"
  console.log("Language: " + lang)
  return new Promise((resolve) => {
    fetch(`${import.meta.env.VITE_BASE}lang/${lang}.json`).then(res => res.json()).then(data => resolve(data))
  })
}

// pageData存储
export class PageData  {
  constructor() {
    Object.assign(this, sessionStorage.getItem("pageData") ? JSON.parse(sessionStorage.getItem("pageData")) : {})
  }
  set(key,val){
    this[key] = val
    sessionStorage.setItem("pageData",JSON.stringify(this))
  }
}

//全局跳转判定
export class PushControl{
  constructor() {
    this.isPushing = false
  }
  async push(path){
    await router.isReady();
    const route = router.currentRoute.value.fullPath;
    console.log("current route: ", router.currentRoute)
    const nextRoute = registerList[registerList.findIndex(i=> i.path === route) + 1]
    const pushUrl = path || nextRoute.path
    // 点击埋点
    mixpanel.setmMxpanelValueSelectAuto(route)
    console.log("push to ", pushUrl)
    await nextRoute.meta.preload()
    await router.push(pushUrl)
  }
}

/*
  * @param {Object} info - 计算参数
  * @param { number } info.height - 体重默认单位cm
  * @param { number } info.weight - 体重默认单位kg
  * @param { Boolean } info.isFt - 身高单位是否为英尺，默认false（即厘米）
  * @param { Boolean } info.isLb - 体重单位是否为磅，默认false（即千克）
  * @returns { number } BMI值
* */
export function BMI({ weight, height,isFt,isLb}) {
    weight = Number(weight);
    height = Number(height);
    weight = isLb ? weight * 0.4536 : weight; // 将体重从磅转换为千克
    height = isFt ? ( parseInt(height/100) + (height%100)/12 ) * 30.48 : height; // 将身高从英尺转换为厘米
    const heightInMeters = height / 100; // 将身高从厘米转换为米
    return weight / (heightInMeters * heightInMeters); // 计算BMI
}