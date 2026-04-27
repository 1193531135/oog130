// config/index.js
import dev from './dev'
import prod from './prod'

const env = import.meta.env.MODE

const configMap = {
    development: dev,
    production: prod
}
export const webConfig = {
    ...configMap[env],
    progectName: "oog104", //接口项目名称
    systemApiVersion: {
        sendTempMail: "v1",
        sendContactUsEmail: "v1",
        getSubscriptionList: "v1",
        getPriceList: "v4",
        createCheckoutSessionEmbedded: "v3",
        createCheckoutPaypalSession: 'v3',
        synchPaypalSubscription: 'v1',
        getSubscriptionInfo: "v1",
        getPaypalSubscriptionInfo: 'v1',
        cancelSubscription: "v1",
        transferSubscription: "v3",
        resumeSubscriptionInfo: "v1",
        mergeMixpanelData: "v1",
        getPayPlatformName: "v1"
    },
}

export default webConfig