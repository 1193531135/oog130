// Function 模式默认隐藏进度条
import { push } from "@/tool/index.js";

const images = import.meta.glob('@/assets/image/*', { eager: true })
console.log("images", images)
const config = {
    ageQuestion: () => import("@/components/AgeQuestion.vue"),
    Over70million: {
        module: () => import("@/components/Over70million.vue")
    },
    MilitaryCalisthenicsBefore: {
        module: () => import("@/components/pageModule/TextSelect.vue"),
        props(content) {
            content.options = content.selectOptions.map((i, index) => ({label: i, value: index}))
            return content
        }
    },
    MilitaryCalisthenicsBeforeSelected: () => import("@/components/MilitaryCalisthenicsBeforeSelected.vue"),
    MainGoal: {
        module:() => import("@/components/MainGoal.vue")
    },
    MainGoalSelected: ()=> import("@/components/MainGoalSelected.vue"),
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
    SelectAreas: "",
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
                push(val === 0 ? undefined: "/breathOnStairs")
            }
            return content
        }
    },
    symptomsHave: {
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
    BreathOnStairs: "",
    Train: "",
    Walks: "",
    WillingWorkout: "",
    WorkScheduleLike: "",
    DescribeTypicalDay: "",
    CurrentEnergyLevels: "",
    MilitaryCalisthenics: () => import("@/components/MilitaryCalisthenics.vue"),
    DrinkDaily: "",
    UsuallyGet: "",
    FollowDiets: "",
    FollowHabits: "",
    FoodCravings: "",
    EatingHabits: "",
    FollowingFew: "",
    YourHeight: {
        module: () => import("@/components/YourHeight.vue"),
    },
    CurrentWeight: "",
    TargetWeight: "",
    DateOfBirth: "",
    PersonalSummary: "",
    ComingUp: "",
    EventTime: "",
    FinallyGet: "",
    MotivationShape: "",
    ConfidentReaching: "",
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
            config:{
                progressHidden: true
            }
        }
    }
    if(config[key]){
        config[key].config || (config[key].config = {})
    }
})
export const pageConfig = config