/*
 mixpanel埋点参考文档：https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript
 字段文档地址：https://laientech.feishu.cn/base/QDdRbT2ZUaWB3ysfJIScdhGSn1b?from=from_copylink
 */
import mixpanel from 'mixpanel-browser';
import sdkConfig from '@/config/index.js';
import { mergeMixpanelData } from "@/api/system"
// import utils from '@/utils/utils';
mixpanel.init(sdkConfig.mixpanelConfig.token, { debug: false });

let mixpanelSessionId = window.sessionStorage.getItem('mixpanelDeviceId'); //优先读取缓存
let distinctId
let str = "user_"

if (!mixpanelSessionId) {
    mixpanel.reset();//重置
    distinctId = str + mixpanel.get_distinct_id();
    window.sessionStorage.setItem('mixpanelDeviceId', distinctId); // 存入缓存
}
let mixpanelDeviceId = (mixpanelSessionId ? mixpanelSessionId : distinctId);
//解决输入地址无法存储问题
setTimeout(() => {
    window.sessionStorage.setItem('mixpanelDeviceId', mixpanelDeviceId); // 存入缓存
}, 2000);
mixpanel.identify(mixpanelDeviceId);
//设置公共参数
function setMixpanelPublicParams(info) {
    const { Keyword, lpid, ldpg } = utils.getUrlParams(window.location.href);
    info.Keyword = Keyword || "";
    info.ldpg = ldpg || "";
    info.flow_name = sdkConfig.flowName;
    info.custom_initial_referrer = document.referrer;
    info.price_group = utils.getMixpanelPriceGroup(lpid);
    return info
}
//字符串转小写
function lowercaseStr(str) {
    return str.toLowerCase()
}
export function setmMixpaneltSesstion() {
    let mixpanelDeviceId = window.sessionStorage.getItem('mixpanelDeviceId');
    if (!mixpanelDeviceId || mixpanelDeviceId != mixpanel.get_distinct_id())
        window.sessionStorage.setItem('mixpanelDeviceId', mixpanel.get_distinct_id());
}
//重置
export function resetMixpannel() {
    mixpanel.reset();//重置
    let distinctId = str + mixpanel.get_distinct_id();
    window.sessionStorage.setItem('mixpanelDeviceId', distinctId); // 存入缓存
    mixpanel.identify(distinctId);
}
//初始化
export function setIdentify(id) {
    window.sessionStorage.setItem('mixpanelDeviceId', id); // 存入缓存
    mixpanel.identify(id);
}
//设置埋点单一值
export function setmMxpanelValue(eventKey, key, value) {
    key = key.charAt(0).toUpperCase() + key.slice(1);
    let info = {};
    info = setMixpanelPublicParams(info);
    info[key] = value;
    mixpanel.track(`${eventKey} ${key} Web`, info)
}
// 设置埋点对象值
export function setmMxpanelInfo(eventKey, key, info) {
    key = key.charAt(0).toUpperCase() + key.slice(1);
    info = info ? info : {}
    info = setMixpanelPublicParams(info);
    mixpanel.track(`${eventKey} ${key} Web`, info)
}
//设置埋点数组
export function setmMxpanelData(eventKey, key, data) {
    key = key.charAt(0).toUpperCase() + key.slice(1);
    let array = [], info = {};
    let screenNameList = ["AgeGroupScreen", "HeightScreen", "CurrentWeightScreen", "TargetWeightScreen", "AgeScreen", "EventDateScreen", "EmailScreen"]
    //是否为数组
    if (Array.isArray(data)) {
        array = data.map(item => lowercaseStr(item))
    } else if (typeof data == 'string' || typeof data == 'number') {
        if (screenNameList.includes(key)) {
            array = data
        } else {
            array.push(lowercaseStr(data))
        }

    }
    else {
        array.push(data)
    }
    info[key] = array;
    info = setMixpanelPublicParams(info);
    mixpanel.track(`${eventKey} ${key} Web`, info)
}
// 设置用户信息
export function setmMxpanelUserInfo(info) {
    info = setMixpanelPublicParams(info);
    mixpanel.people.set(info)
}
// 设置用户单信息
export function setmMxpanelUserValue(key, value) {
    let info = {};
    info = setMixpanelPublicParams(info);
    info[key] = value;
    mixpanel.people.set(info)
}
//合并mixpanel数据
export async function mergeMixpanelinfo(oldDeviceId) {
    let deviceId = mixpanel.get_distinct_id();
    window.sessionStorage.setItem('mixpanelDeviceId', deviceId); // 存入缓存
    mixpanel.identify(oldDeviceId)
    if (oldDeviceId != deviceId) {
        await mergeMixpanelData(oldDeviceId, deviceId)
    }
}




