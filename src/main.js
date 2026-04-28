import { createApp } from 'vue'
import './style.less'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
import { DatePicker,Input,Spin } from 'ant-design-vue';

const app = createApp(App)

app.use(DatePicker);
app.use(Input);
app.use(Spin);

app.use(router)
app.use(createPinia())
app.mount('#app')
