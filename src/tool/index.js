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
    this.data = sessionStorage.getItem("pageData") ? JSON.parse(sessionStorage.getItem("pageData")) : {}
  }
  set(key,val){
    this.data[key] = val
    sessionStorage.setItem("pageData",JSON.stringify(this.data))
  }
  get(){
    return this.data
  }
}

//全局跳转判定
export function push(path){
  console.log("push", path)
  const route = router.currentRoute.value.fullPath
  const pushUrl = registerList[registerList.findIndex(i=> i.path === route) + 1].path
  // 触发太快延迟触发
  setTimeout(()=>{
    router.push(path || pushUrl)
  },100)
}