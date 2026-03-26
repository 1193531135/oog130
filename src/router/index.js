// router/index.js
import { defineComponent, defineAsyncComponent, h, ref } from "vue"
import { createRouter, createWebHashHistory } from 'vue-router'
import { pageConfig } from "@/config.js"
// 引入模板

const autoRegisterList = Object.keys(pageConfig).filter(i => pageConfig[i]).map((name) => {
    // 格式化简单传入的数据
    pageConfig[name].constructor === Function && (pageConfig[name] = { module:pageConfig[name]})
    // 创建模板壳子
    const component = defineComponent({
        setup() {
            const templateProps = ref({})
            const Comp = defineAsyncComponent(async () => {
                const pageText = window.languageData[name]
                const props = pageConfig[name].props ? pageConfig[name].props(pageText) : pageText
                templateProps.value = props
                const module = await pageConfig[name].module()
                return module.default
            })

            return () => h(Comp, templateProps.value)
        }
    })
    return {
        path: '/' + name[0].toLowerCase() + name.substring(1),
        name,
        component,
    }
})

const routes = [
    { path: '/', redirect: '/ageQuestion' },
    ...autoRegisterList,
]

export const router = createRouter({
    history: createWebHashHistory(), // 👈 关键在这里
    routes
})

export const registerList = autoRegisterList