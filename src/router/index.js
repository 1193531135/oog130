// router/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/home',
        name: 'home',
        component: () => import('@/components/AgeQuestion.vue'),
    },
    {
        path: '/importantEventComingUp',
        name: 'importantEventComingUp',
        component: () => import('@/components/ImportantEventComingUp.vue'),
    },
    {
        path: '/motivatesYou2Exercise',
        name: 'motivatesYou2Exercise',
        component: () => import('@/components/MotivatesYou2Exercise.vue'),
    },
    {
        path: '/haveYouEverSelected',
        name: 'haveYouEverSelected',
        component: () => import('@/components/HaveYouEverSelected.vue'),
    }
]

const router = createRouter({
    history: createWebHashHistory(), // 👈 关键在这里
    routes
})

export default router