import request from "@/request/index.js";
import webConfig from "@/config/index.js";
// 发送模版邮件
export function sendTempMail(data) {
    return request.post(`/stripe/${webConfig.progectName}/email/${webConfig.systemApiVersion.sendTempMail}/sendTempMail`, data)
}
// 发送邮件联系我们
export function sendContactUsEmail(data) {
    return request.post(`/stripe/${webConfig.progectName}/email/${webConfig.systemApiVersion.sendContactUsEmail}/sendMail`, data)
}

// 获取订阅列表
export function getSubscriptionList(uid) {
    return request.get(`/stripe/${webConfig.progectName}/subscription/${webConfig.systemApiVersion.getSubscriptionList}/${uid}/listByMe`)
}
// 获取商品列表
export function getPriceList(uid, params) {
    return request.get(`/stripe/${webConfig.progectName}/product/${webConfig.systemApiVersion.getPriceList}/${uid}/list`, {
        params
    })
}
// 创建stripe嵌入式支付订单
export function createCheckoutSessionEmbedded(uid, data) {
    return request.post(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.createCheckoutSessionEmbedded}/${uid}/checkoutSessionEmbedded`, data)
}
// 创建paypal支付订单
export function createCheckoutPaypalSession(uid, data) {
    return request.post(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.createCheckoutPaypalSession}/${uid}/checkoutPaypalSession`, data)
}

//获取订阅付款详信息
export function getSubscriptionInfo(uid, checkSessionId) {
    return request.get(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.getSubscriptionInfo}/${uid}/getPayInfo/${checkSessionId}`)
}
//获取paypal订阅付款信息
export function getPaypalSubscriptionInfo(uid, subscriptionId) {
    return request.get(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.getPaypalSubscriptionInfo}/${uid}/getPayInfoBySubscription/${subscriptionId}`)
}

// cancel(取消自动续订)
export function cancelSubscription(uid, data) {
    return request.post(`/stripe/${webConfig.progectName}/subscription/${webConfig.systemApiVersion.cancelSubscription}/${uid}/cancel`, data)
}
//订阅关系转移
export function transferSubscription(uid, data) {
    return request.post(`/stripe/${webConfig.progectName}/subscription/${webConfig.systemApiVersion.transferSubscription}/${uid}/transfer`, data)
}
// 手动同步paypal支付结果
export function synchPaypalSubscription(uid, subscriptionId) {
    return request.post(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.synchPaypalSubscription}/${uid}/synchPaypalSubscription`, {
        subscriptionId
    })
}
// resume(恢复自动续订)
export function resumeSubscriptionInfo(uid, data) {
    return request.post(`/stripe/${webConfig.progectName}/subscription/${webConfig.systemApiVersion.resumeSubscriptionInfo}/${uid}/resume`, data)
}
// 合并mixpanel数据
export function mergeMixpanelData(id1, id2) {
    return request.post(`/stripe/${webConfig.progectName}/mixpanel/${webConfig.systemApiVersion.mergeMixpanelData}/merge`, {
        id1, id2
    })
}
// 获取支付平台名称
export function getPayPlatformName(uid, productIdentifier) {
    return request.get(`/stripe/${webConfig.progectName}/payment/${webConfig.systemApiVersion.getPayPlatformName}/${uid}/getPayPlatform/${productIdentifier}`)
}
