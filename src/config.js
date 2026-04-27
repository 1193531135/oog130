// Function 模式默认隐藏进度条
import { PageData, BMI } from "@/tool/index.js";

const images = import.meta.glob('@/assets/image/*', { eager: true })

// 预加载图片
Object.values(images).forEach((src) => {
    const img = new Image()
    img.src = src.default
})

const textSelectDefaultConfig = {
    module: () => import("@/components/pageModule/TextSelect.vue"),
    props(content) {
        content.options = content.selectOptions.map((i, index) => ({ label: i, value: index, ...i }))
        return content
    }
}
const config = {
    TaiChiBeginners: () => import('@/components/TaiChiBeginners.vue'),
    ChooserGender: {
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/chooserGender-${index}.webp`]?.default
            }))
            return content
        }
    },
    TaiChiExperienceCheck: () => import('@/components/TaiChiExperienceCheck.vue'),
    TaiChiBeginnerGuide: {
        module: () => import('@/components/TaiChiBeginnerGuide.vue'),
    },
    TaiChiMainGoalSelection: () => import('@/components/TaiChiMainGoalSelection.vue'),
    TaiChiPersonalizationIntro: {
        module: () => import('@/components/TaiChiPersonalizationIntro.vue'),
    },
    TaiChiExerciseMotivation: textSelectDefaultConfig,
    TaiChiCurrentBodyType: {
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions[pageData.ChooserGender].map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiCurrentBodyType-${male}-${index}.webp`]?.default
            }))
            return content
        }
    },
    TaiChiTargetBodyType: {
        module: () => import("@/components/pageModule/CardSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions[pageData.ChooserGender].map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiTargetBodyType-${male}-${index}.webp`]?.default
            }))
            return content
        }
    },
    TaiChiBestShapeCheck: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images["/src/assets/image/taiChiBestShapeCheck-bg.webp"]?.default
            return content
        }
    },
    TaiChiFlexibilityCheck: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images["/src/assets/image/taiChiFlexibilityCheck-bg.webp"]?.default
            return content
        }
    },
    TaiChiTargetZoneSelection: {
        module: () => import('@/components/TaiChiTargetZoneSelection.vue'),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({
                label: i, value: index,
                imgUrl: images[`/src/assets/image/taiChiTargetZoneSelection-${male}-${index}.webp`]?.default
            }))
            return content
        }
    },
    TaiChiPhysicalDiscomfortCheck: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images[`/src/assets/image/taiChiPhysicalDiscomfortCheck-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiGentleExerciseIntro: {
        module: () => import('@/components/TaiChiGentleExerciseIntro.vue'),
    },
    TaiChiStairBreathCheck: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images[`/src/assets/image/taiChiStairBreathCheck-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiTrainingFrequency: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.imageOffset = ['-30px', 0]
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images[`/src/assets/image/taiChiTrainingFrequency-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiWalkingFrequency: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))

            content.imgUrl = images[`/src/assets/image/taiChiWalkingFrequency-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiWorkoutDurationPref: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images[`/src/assets/image/taiChiWorkoutDurationPref-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiWorkScheduleType: textSelectDefaultConfig,
    TaiChiDailyActivityCheck: textSelectDefaultConfig,
    TaiChiEnergyLevelCheck: textSelectDefaultConfig,
    TaiChiDailyWaterIntake: () => import('@/components/TaiChiDailyWaterIntake.vue'),
    TaiChiSleepDurationCheck: textSelectDefaultConfig,
    TaiChiDietTypeSelection: textSelectDefaultConfig,
    TaiChiEatingHabitCheck: textSelectDefaultConfig,
    TaiChiFoodCravingsCheck: textSelectDefaultConfig,
    TaiChiEatingHabitImproveCheck: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            const pageData = new PageData()
            const male = pageData["ChooserGender"] || 0
            content.options = content.selectOptions.map((i, index) => ({ label: i, value: index }))
            content.imgUrl = images[`/src/assets/image/taiChiEatingHabitImproveCheck-bg-${male}.webp`]?.default
            return content
        }
    },
    TaiChiBodyChangeFactorCheck: textSelectDefaultConfig,
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
    DateOfBirth: {
        module: () => import('@/components/DateOfBirth.vue')
    },
    EnterEmail: {
        module: () => import('@/components/EnterEmail.vue')
    },
    EndAnimation: {
        module: () => import('@/components/EndAnimation.vue'),
        props(content) {
            content.bgImageList = [
                images["/src/assets/image/EndAnimation_bg1.webp"]?.default,
                images["/src/assets/image/EndAnimation_bg2.webp"]?.default,
                images["/src/assets/image/EndAnimation_bg3.webp"]?.default,
                images["/src/assets/image/EndAnimation_bg4.webp"]?.default
            ]
            return content
        }
    },
    MakeCommitment: {
        module: () => import('@/components/MakeCommitment.vue')
    },
    ProgressLoading: {
        module: () => import('@/components/ProgressLoading.vue')
    },
    Superwall: {

        module: () => import('@/components/Superwall.vue'),
        props(content) {
            const pageData = new PageData()
            const nowBMI = BMI({
                height: pageData['YourHeight'].value,
                weight: pageData['CurrentWeight'].value,
                isFt: pageData['YourHeight']?.unit == "ft/in",
                isLb: pageData['CurrentWeight']?.unit == "lb"
            }).toFixed(2)
            if (nowBMI < 18) {
                content.promptNum = window.languageData["Superwall"].promptNum[0]
            } else if (nowBMI >= 19 && nowBMI < 25) {
                content.promptNum = window.languageData["Superwall"].promptNum[1]
            } else if (nowBMI >= 26 && nowBMI < 35) {
                content.promptNum = window.languageData["Superwall"].promptNum[2]
            } else {
                content.promptNum = window.languageData["Superwall"].promptNum[3]
            }
            console.log('content.promptNum ',content.promptNum )
            const male = pageData["ChooserGender"] || 0
            content.bgImageList = [
                images[`/src/assets/image/superwall_img1_${male}.png`]?.default,
                images[`/src/assets/image/superwall_img2_${male}.png`]?.default,
                images[`/src/assets/image/superwall_img5_${male}.png`]?.default,
            ]
            return content
        }
    }

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
