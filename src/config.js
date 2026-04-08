// Function 模式默认隐藏进度条
import {push} from "@/tool/index.js";

const images = import.meta.glob('@/assets/image/*', { eager: true })

const textSelectDefaultConfig = {
    module: () => import("@/components/pageModule/TextSelect.vue"),
    props(content) {
        content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
        return content
    }
}
const config = {
    TaiChiBeginners:() => import('@/components/TaiChiBeginners.vue'),
    ChooserGender:{
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/chooserGender-${index}.png`]?.default
            }))
            return content
        }
    },
    TaiChiExperienceCheck:() => import('@/components/TaiChiExperienceCheck.vue'),
    TaiChiBeginnerGuide: {
        module: () => import('@/components/TaiChiBeginnerGuide.vue'),
    },
    TaiChiMainGoalSelection:() => import('@/components/TaiChiMainGoalSelection.vue'),
    TaiChiPersonalizationIntro: {
        module: () => import('@/components/TaiChiPersonalizationIntro.vue'),
    },
    TaiChiExerciseMotivation:textSelectDefaultConfig,
    TaiChiCurrentBodyType:{
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiCurrentBodyType-${male}-${index}.png`]?.default
            }))
            return content
        }
    },
    TaiChiTargetBodyType:{
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiTargetBodyType-${male}-${index}.png`]?.default
            }))
            return content
        }
    },
    TaiChiBestShapeCheck:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images["/src/assets/image/taiChiBestShapeCheck-bg.png"]?.default
            return content
        }
    },
    TaiChiFlexibilityCheck:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images["/src/assets/image/taiChiFlexibilityCheck-bg.png"]?.default
            return content
        }
    },
    TaiChiTargetZoneSelection:{
        module:() => import('@/components/TaiChiTargetZoneSelection.vue'),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiTargetZoneSelection-${male}-${index}.png`]?.default
            }))
            return content
        }
    },
    TaiChiPhysicalDiscomfortCheck:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiPhysicalDiscomfortCheck-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiGentleExerciseIntro: {
        module: () => import('@/components/TaiChiGentleExerciseIntro.vue'),
    },
    TaiChiStairBreathCheck:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiStairBreathCheck-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiTrainingFrequency:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiTrainingFrequency-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiWalkingFrequency:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiWalkingFrequency-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiWorkoutDurationPref:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiWorkoutDurationPref-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiWorkScheduleType:textSelectDefaultConfig,
    TaiChiDailyActivityCheck:textSelectDefaultConfig,
    TaiChiEnergyLevelCheck:textSelectDefaultConfig,
    TaiChiDailyWaterIntake:() => import('@/components/TaiChiDailyWaterIntake.vue'),
    TaiChiSleepDurationCheck:textSelectDefaultConfig,
    TaiChiDietTypeSelection:textSelectDefaultConfig,
    TaiChiEatingHabitCheck:textSelectDefaultConfig,
    TaiChiFoodCravingsCheck:textSelectDefaultConfig,
    TaiChiEatingHabitImproveCheck:{
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images[`/src/assets/image/taiChiEatingHabitImproveCheck-bg-${male}.png`]?.default
            return content
        }
    },
    TaiChiBodyChangeFactorCheck:textSelectDefaultConfig,
    YourHeight: {
        module: () => import('@/components/YourHeight.vue'),
    },
    CurrentWeight: {
        module: () => import('@/components/CurrentWeight.vue')
    },
    TargetWeight: {
        module: () => import('@/components/TargetWeight.vue')
    },
    UserName: {
        module: () => import('@/components/UserName.vue')
    },
    DateOfBirth: '',
    EnterEmail: {
        module: () => import('@/components/EnterEmail.vue')
    },
    EndAnimation: {
        module: () => import('@/components/EndAnimation.vue'),
        props(content){
            content.bgImageList = [
                images["/src/assets/image/EndAnimation_bg1.png"]?.default,
                images["/src/assets/image/EndAnimation_bg2.png"]?.default,
                images["/src/assets/image/EndAnimation_bg3.png"]?.default,
                images["/src/assets/image/EndAnimation_bg4.png"]?.default
            ]
            return content
        }
    },
    MakeCommitment: {
        module: () => import('@/components/MakeCommitment.vue')
    },
    ProgressLoading: ''
    
}
// 做一些统一处理
Object.keys(config).forEach(key => {
    if (config[key].constructor === Function) {
        config[key] = {
            module: config[key],
        }
    }
    if (config[key]) {
        config[key].config || (config[key].config = {})
    }
})
export const pageConfig = config
