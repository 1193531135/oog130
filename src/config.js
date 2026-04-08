// Function 模式默认隐藏进度条
import {push} from "@/tool/index.js";
import {PageData} from "@/tool/index.js";

const images = import.meta.glob('@/assets/image/*', {eager: true})

const textSelectDefaultConfig = {
    module: () => import("@/components/pageModule/TextSelect.vue"),
    props(content) {
        content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
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
    TaiChiBeginnerGuide:'',
    TaiChiMainGoalSelection:() => import('@/components/TaiChiMainGoalSelection.vue'),
    TaiChiPersonalizationIntro:'',
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
    TaiChiGentleExerciseIntro:'',
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
    YourHeight:'',
    CurrentWeight:'',
    TargetWeight:'',
    UserName:'',
    DateOfBirth:'',
    EnterEmail:'',
    EndAnimation:'',
    MakeCommitment:'',
    ProgressLoading:''
    
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
