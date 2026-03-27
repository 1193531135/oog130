// Function 模式默认隐藏进度条
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
    ChooseBodyType: "",
    ChooseBodyWant: "",
    WeightTypicallyChange: "",
    BestShapeOfYourLife: "",
    Flexible: "",
    SelectAreas: "",
    StruggleWithFollowing: "",
    StruggleWithFollowingSelected: () => import("@/components/StruggleWithFollowingSelected.vue"),
    CurrentlyPerimenopauseOrMenopause: "",
    symptomsHave: "",
    ExperienceSimilarSymptoms: "",
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
    YourHeight: "",
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