import queryString from 'querystring';
import { router,registerList } from "@/router/index.js";
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
    console.log("push", path)
    const route = router.currentRoute.value.fullPath;
    const nextRoute = registerList[registerList.findIndex(i=> i.path === route) + 1]
    const pushUrl = nextRoute.path
    await nextRoute.meta.preload()
    await router.push(path || pushUrl)
  }
}