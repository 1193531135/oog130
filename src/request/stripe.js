import axios from 'axios';
import webConfig from '@/config/web.config';

const serviceService = axios.create({
    baseURL:  webConfig.apiConfig.stripeBaseUrl,
    timeout: 50000
});

// 请求拦截器
serviceService.interceptors.request.use(
    config => {
       
        config.headers['content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        config.headers['X-Platform'] = 'web';
        config.headers["Authorization"] = `Bearer ${webConfig.stripeConfig.revenuecatStripeAppPublicApiKey}`
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
// 响应拦截器
serviceService.interceptors.response.use(
    response => {
        const res = response.data;
        if (response.status == 200 && res) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default serviceService;