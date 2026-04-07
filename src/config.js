// Function 模式默认隐藏进度条
import {push} from "@/tool/index.js";

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
    ChooserGender:'',
    TaiChiExperienceCheck:'',
    TaiChiBeginnerGuide:'',
    TaiChiMainGoalSelection:'',
    TaiChiPersonalizationIntro:'',
    TaiChiExerciseMotivation:'',
    TaiChiCurrentBodyType:'',
    TaiChiTargetBodyType:'',
    TaiChiBestShapeCheck:'',
    TaiChiFlexibilityCheck:'',
    TaiChiTargetZoneSelection:'',
    TaiChiPhysicalDiscomfortCheck:'',
    TaiChiGentleExerciseIntro:'',
    TaiChiStairBreathCheck:'',
    TaiChiTrainingFrequency:'',
    TaiChiWalkingFrequency:'',
    TaiChiWorkoutDurationPref:'',
    TaiChiWorkScheduleType:'',
    TaiChiDailyActivityCheck:'',
    TaiChiEnergyLevelCheck:'',
    TaiChiDailyWaterIntake:'',
    TaiChiSleepDurationCheck:'',
    TaiChiDietTypeSelection:'',
    TaiChiEatingHabitCheck:'',
    TaiChiFoodCravingsCheck:'',
    TaiChiEatingHabitImproveCheck:'',
    TaiChiBodyChangeFactorCheck:'',
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
