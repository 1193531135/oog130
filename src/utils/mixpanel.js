/*
 mixpanel埋点参考文档：https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript
 字段文档地址：https://laientech.feishu.cn/base/QDdRbT2ZUaWB3ysfJIScdhGSn1b?from=from_copylink
 */
import mixpanel from 'mixpanel-browser';
import sdkConfig from '@/config/index.js';
import { mergeMixpanelData } from "@/api/system"
import utils from '@/utils/utils';

export default class Mixpanel {
    constructor() {
        this.mixpanel = mixpanel;
        this.token = sdkConfig.mixpanelConfig.token;
        mixpanel.init(this.token, { debug: false });
    }
    init(id) {
        const mixpanelDeviceId = id || utils.getUrlParams(window.location.href)?.id || sessionStorage.getItem('uid')
        this.mixpanel.identify(mixpanelDeviceId)
        console.log("Mixpanel initialized with ID:", mixpanelDeviceId);
    }
    //设置公共参数
    setMixpanelPublicParams(info) {
        return info
    }
    //字符串转小写
    lowercaseStr(str) {
        return str.toLowerCase()
    }
    //设置埋点单一值
    setmMxpanelValue(eventKey, key, value) {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        let info = {};
        info = setMixpanelPublicParams(info);
        info[key] = value;
        mixpanel.track(`${eventKey} ${key} Web`, info)
    }
    setmMxpanelUserInfo(info) {
        info = setMixpanelPublicParams(info);
        mixpanel.people.set(info)
    }
    //合并mixpanel数据
    async mergeMixpanelInfo(oldDeviceId) {
        let deviceId = mixpanel.get_distinct_id();
        window.sessionStorage.setItem('mixpanelDeviceId', deviceId); // 存入缓存
        mixpanel.identify(oldDeviceId)
        if (oldDeviceId != deviceId) {
            await mergeMixpanelData(oldDeviceId, deviceId)
        }

    }
}



