import { defineStore } from 'pinia'

export const useStore = defineStore('counter', {
    state: () => ({
        count: 0,
        steps: [
            { path: '/', completed: false, select:null },
            { path: '/about', completed: false, select:null },
            { path: '/summary', completed: false, select:null },
        ]
    }),
    actions: {
        increment() {
            this.count++
        }
    }
})