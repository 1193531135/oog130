/*
 mixpanel埋点参考文档：https://docs.mixpanel.com/docs/tracking-methods/sdks/javascript
 字段文档地址：https://laientech.feishu.cn/base/QDdRbT2ZUaWB3ysfJIScdhGSn1b?from=from_copylink
 */

import mixpanel from 'mixpanel-browser';
import sdkConfig from '@/config/index.js';
import { mergeMixpanelData } from "@/api/system/index.js"
import utils from '@/utils/utils.js';
import dataMap from "@/config/en.json"
import {BMI, PageData} from "@/tool/index.js"

mixpanel.init(sdkConfig.mixpanelConfig.token, { debug: true });

function getPageOptions(pathName) {
    const data = dataMap[pathName];
    if(data) {
        return data.selectOptions || null
    }
    else {
        throw "pathName not found in dataMap"
    }
}

export const eventProps = {
    "/taiChiBeginners": { eventKey:"OB Started Clicked Web"},
    "/chooserGender": { eventKey:"OB Gender Web",dataKey:"gender"},
    "/taiChiExperienceCheck": { eventKey:"OB Ever Web",dataKey:"ever"},
    "/taiChiBeginnerGuide": { eventKey:"OB Right Place Web"},
    "/taiChiMainGoalSelection": { eventKey:"OB Goal Web",dataKey:"goal"},
    "/taiChiPersonalizationIntro": { eventKey:"OB Need Web"},
    "/taiChiExerciseMotivation": { eventKey:"OB Motivates Web",dataKey:"motivates"},
    // 数据格式为二维数组，因为男女问题
    "/taiChiCurrentBodyType": { eventKey:"OB Body Type Web",dataKey:"body_type"},
    // 数据格式为二维数组，因为男女问题
    "/taiChiTargetBodyType": { eventKey:"OB Target Body Type Web",dataKey:"target_body_type"},

    "/taiChiBestShapeCheck": { eventKey:"OB Last Time Body Happy Web",dataKey:"last_time_body_happy"},
    "/taiChiFlexibilityCheck": { eventKey:"OB Flexible Web",dataKey:"flexible_happy"},
    "/taiChiTargetZoneSelection": { eventKey:"OB Target Zones Web",dataKey:"target_zones"},
    "/taiChiPhysicalDiscomfortCheck": { eventKey:"OB Restrictions Web",dataKey:"restrictions"},
    "/taiChiGentleExerciseIntro": { eventKey:"OB Covered Web"},
    "/taiChiStairBreathCheck": { eventKey:"OB Breathing Web",dataKey:"breathing"},
    "/taiChiTrainingFrequency": { eventKey:"OB Train Web",dataKey:"train"},
    "/taiChiWalkingFrequency": { eventKey:"OB Walks Web",dataKey:"walks"},
    "/taiChiWorkoutDurationPref": { eventKey:"OB Duration Web",dataKey:"duration"},
    "/taiChiWorkScheduleType": { eventKey:"OB Schedule Web",dataKey:"schedule"},
    "/taiChiDailyActivityCheck": { eventKey:"OB Typical Day Web",dataKey:"typical_day"},
    "/taiChiEnergyLevelCheck": { eventKey:"OB Energy Levels Web",dataKey:"energy_levels"},
    "/taiChiDailyWaterIntake": { eventKey:"OB Water Web",dataKey:"water"},
    "/taiChiSleepDurationCheck": { eventKey:"OB Sleep Web",dataKey:"sleep"},
    "/taiChiDietTypeSelection": { eventKey:"OB Diets Web",dataKey:"diets"},
    "/taiChiEatingHabitCheck": { eventKey:"OB Habits Web",dataKey:"habits"},
    "/taiChiFoodCravingsCheck": { eventKey:"OB Food Cravings Web",dataKey:"food_cravings"},
    "/taiChiEatingHabitImproveCheck": { eventKey:"OB Improving Eating Habits Web",dataKey:"improving_eating_habits"},
    "/taiChiBodyChangeFactorCheck": { eventKey:"OB Affected Web",dataKey:"affected"},
    // 参数结构原因，需要特殊处理
    "/yourHeight": { eventKey:"OB Height Web",dataKey:"height"},
    // 参数结构原因，需要特殊处理
    "/currentWeight": { eventKey:"OB Weight Web",dataKey:"weight"},
    // 参数结构原因，需要特殊处理
    "/targetWeight": { eventKey:"OB Target Weight Web",dataKey:"target_weight"},
    "/userName": { eventKey:"OB Name Web"},
    "/dateOfBirth": { eventKey:"OB Birthday Web",dataKey:"birthday"},
    "/enterEmail": { eventKey:"OB Email Web",dataKey:"email"},
    "/endAnimation": { eventKey:"OB 7 Min Web" },
    "/makeCommitment": { eventKey:"OB Ready Web" },
    // OB Completed Web 单独埋点，页面渲染就报
    // "/progressLoading": { eventKey:"OB Completed Web" },
    // paywall 页面比较复杂，单独埋点
}

export class Mixpanel {
    constructor() {
        this.mixpanel = mixpanel;
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
    setmMxpanelValue(eventName, info) {
        info = this.setMixpanelPublicParams(info);
        this.mixpanel.track(eventName, info)
        console.log("mixpanel event：", eventName, info)
    }
    // 根据路由自动化设置点击埋点值
    setmMxpanelValueSelectAuto(path){
        const config = eventProps[path];
        const pageName = path[1].toUpperCase() + path.substring(2)
        const info = {};
        if(config){
            if(config.dataKey) {
                const dataKey = "ob_" + config.dataKey
                let dataValue = ""
                const pageData = new PageData();
                const value = pageData[pageName]
                if(value === undefined) throw `${pageName}数据不存在`;
                const options = getPageOptions(pageName)
                // 特殊处理
                if(path === "/yourHeight"){
                    info[dataKey] = value.value + value.unit
                }
                else if(path === "/targetWeight"){
                    info[dataKey] = value.value + value.unit
                }
                else if(path === "/currentWeight"){
                    info[dataKey] = value.value + value.unit
                    // 添加bmi参数
                    info["ob_bmi"] = BMI({
                        weight: pageData["CurrentWeight"].value,
                        height: pageData["YourHeight"].value,
                        isFt: pageData["YourHeight"].unit === "ft/in",
                        isLb: pageData["CurrentWeight"].unit === "lb"
                    })
                }
                // 默认处理
                else {
                    dataValue = options ? (options[value].constructor === String ? options[value] : options[value].label) : value
                    info[dataKey] = dataValue
                }
            }
            this.setmMxpanelValue(config.eventKey, info)
        }
    }
    setmMxpanelUserInfo(info) {
        mixpanel.people.set(info)
    }
    //合并mixpanel数据
    async mergeMixpanelInfo(oldDeviceId) {
        let deviceId = mixpanel.get_distinct_id();
        window.sessionStorage.setItem('mixpanelDeviceId', deviceId); // 存入缓存
        mixpanel.identify(oldDeviceId)
        if (oldDeviceId !== deviceId) {
            await mergeMixpanelData(oldDeviceId, deviceId)
        }

    }
}



