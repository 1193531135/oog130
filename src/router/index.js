// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

// 引入模板
import TextSelect from "@/components/pageModule/TextSelect.vue";
const modules = import.meta.glob('../components/*.vue', { eager: true })

const autoRegisterList = Object.keys(modules).map((path) => {
    const name = path.split('/').pop().replace('.vue', '')
    return {
        path: '/' + name[0].toUpperCase() + name.substring(1),
        name,
        component: modules[path].default,
    }
})

console.log(autoRegisterList)
const routes = [
    { path: '/', redirect: '/AgeQuestion' },
    ...autoRegisterList,
]

const router = createRouter({
    history: createWebHashHistory(), // 👈 关键在这里
    routes
})

export default router