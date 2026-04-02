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
    ageQuestion: () => import("@/components/AgeQuestion.vue"),
    Over70million: {
        module: () => import("@/components/Over70million.vue")
    },
    MilitaryCalisthenicsBefore: textSelectDefaultConfig,
    MilitaryCalisthenicsBeforeSelected: () => import("@/components/MilitaryCalisthenicsBeforeSelected.vue"),
    MainGoal: {
        module: () => import("@/components/MainGoal.vue")
    },
    MainGoalSelected: () => import("@/components/MainGoalSelected.vue"),
    MotivatesYou2Exercise: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))
            content.multiple = true
            return content
        }
    },
    ChooseBodyType: {
        module: () => import("@/components/ChooseBodyType.vue"),
    },
    ChooseBodyWant: {
        module: () => import("@/components/ChooseBodyType.vue"),
    },
    WeightTypicallyChange: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    BestShapeOfYourLife: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    Flexible: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    SelectAreas: {
        module: () => import("@/components/SelectAreas.vue"),
    },
    StruggleWithFollowing: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    StruggleWithFollowingSelected: () => import("@/components/StruggleWithFollowingSelected.vue"),
    CurrentlyPerimenopauseOrMenopause: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.btnAlign = "left"
            content.handleNextStep = (val) => {
                push(val === 0 ? undefined : "/breathOnStairs")
            }
            return content
        }
    },
    SymptomsHave: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))

            return content
        }
    },
    ExperienceSimilarSymptoms: () => import("@/components/ExperienceSimilarSymptoms.vue"),
    BreathOnStairs: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    Train: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    Walks: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    WillingWorkout: {
        module: () => import("@/components/pageModule/ImageSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.imgUrl = images["/src/assets/image/weightTypicallyChange-bg.png"]?.default
            return content
        }
    },
    WorkScheduleLike: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.btnAlign = "left"
            return content
        }
    },
    DescribeTypicalDay: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.btnAlign = "left"
            return content
        }
    },
    CurrentEnergyLevels: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.btnAlign = "left"
            return content
        }
    },
    MilitaryCalisthenics: () => import("@/components/MilitaryCalisthenics.vue"),
    DrinkDaily: {
        module: () => import("@/components/DrinkDaily.vue"),
    },
    UsuallyGet: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            content.btnAlign = "left"
            return content
        }
    },
    FollowDiets: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i.label,
                value: index,
                mutex: index === content.selectOptions.length - 1,
                subLabel: i.subLabel
            }))
            return content
        }
    },
    FollowHabits: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))
            content.multiple = true
            return content
        }
    },
    FoodCravings: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))
            content.multiple = true
            return content
        }
    },
    EatingHabits: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
            }))
            return content
        }
    },
    FollowingFew: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({
                label: i,
                value: index,
                mutex: index === content.selectOptions.length - 1
            }))
            content.multiple = true
            return content
        }
    },
    YourHeight: {
        module: () => import("@/components/YourHeight.vue"),
    },
    CurrentWeight: "",
    TargetWeight: "",
    DateOfBirth: {
        module: () => import("@/components/DateOfBirth.vue"),
    },
    PersonalSummary: "",
    ComingUp: "",
    EventTime: {
        module: () => import("@/components/EventTime.vue"),
    },
    FinallyGet: {
        module: () => import("@/components/FinallyGet.vue"),
    },
    MotivationShape: textSelectDefaultConfig,
    ConfidentReaching: textSelectDefaultConfig,
    EnterEmail: "",
    UserName: "",
    CalisthenicsPlan: "",
    BodyProfile: "",
    MakeCommitment: "",
    MealPlanning: "",
}
// 做一些统一处理
Object.keys(config).forEach(key => {
    if (config[key].constructor === Function) {
        config[key] = {
            module: config[key],
            config: {
                progressHidden: true
            }
        }
    }
    if (config[key]) {
        config[key].config || (config[key].config = {})
    }
})
export const pageConfig = config
