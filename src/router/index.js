// router/index.js
import {defineComponent, defineAsyncComponent, h, shallowRef, onMounted} from "vue"
import { createRouter, createWebHashHistory } from 'vue-router'
import { pageConfig } from "@/config.js"
// 引入模板

const autoRegisterList = Object.keys(pageConfig).filter(i => pageConfig[i]).map((name) => {
    // 留一个预加载的口子
    const loader = pageConfig[name].module
    // 创建模板壳子
    const component = defineComponent({
        setup() {
            const Comp = shallowRef(null)
            const pageText = window.languageData[name]
            const props = pageConfig[name].props ? pageConfig[name].props(pageText) : pageText
            const loadModule = async () => {
                const module = await pageConfig[name].module()
                Comp.value = module.default
            }
            loadModule()
            return () => Comp.value ? h(Comp.value,props):h("div", "Loading...")
        }
    })
    return {
        path: '/' + name[0].toLowerCase() + name.substring(1),
        name,
        component,
        config: pageConfig[name].config,
        meta:{
            preload:loader
        }
    }
})

const routes = [
    { path: '/', redirect: autoRegisterList[0].path },
    ...autoRegisterList,
]

export const router = createRouter({
    history: createWebHashHistory(), // 👈 关键在这里
    routes
})

export const registerList = autoRegisterList