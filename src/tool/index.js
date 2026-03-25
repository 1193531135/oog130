import queryString from 'querystring';

export function readLanguage() {
  const lang = queryString.parse(window.location.search).lang || "en"
  console.log("Language: " + lang)
  return new Promise((resolve) => {
    fetch(`${import.meta.env.VITE_BASE}lang/${lang}.json`).then(res => res.json()).then(data => resolve(data))
  })
}

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