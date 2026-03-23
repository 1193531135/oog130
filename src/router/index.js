// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/components/Start.vue'),
        children:[

        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(), // 👈 关键在这里
    routes
})

export default router