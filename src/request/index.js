import axios from 'axios';
import sha1 from "sha1";
import webConfig from "@/config/index.js"
let service = axios.create({
    baseURL: webConfig.apiConfig.systemBaseUrl,
    timeout: 30 * 1000
});
// 请求拦截器
service.interceptors.request.use(
    config => {
        let timestamp = Date.now();
        let authSecret = config.method == 'post' ? sha1(`${timestamp}&${config.url}&${JSON.stringify(config.data)}&laien&stripe`) : sha1(`${timestamp}&${config.url}&laien&stripe`)
        config.headers['authSecret'] = authSecret;//	校验
        config.headers.timestamp = timestamp; //时间戳
        return config;
    },
    error => {
        Promise.reject(error);
    }
);
// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (response.status == 200 && res && res.code == 200) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res);
        }
    },
    error => {
        return Promise.reject(error);
    }
);

export default service;