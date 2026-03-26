export const pageConfig= {
    ageQuestion: () => import("@/components/AgeQuestion.vue"),
    Over70million:　() => import("@/components/Over70million.vue"),
    MilitaryCalisthenicsBefore: {
        module:() => import("@/components/pageModule/TextSelect.vue"),
        props(content){
            content.options = content.selectOptions.map((i,index) => ({ label: i, value: index }))
            return content
        }
    },
    MilitaryCalisthenicsBeforeSelected:() => import("@/components/MilitaryCalisthenicsBeforeSelected.vue"),
    MainGoal: "",
    MainGoalSelected: "",
    MotivatesYou2Exercise: "",
    ChooseBodyType: "",
    ChooseBodyWant: "",
    WeightTypicallyChange: "",
    BestShapeOfYourLife: "",
    Flexible: "",
    SelectAreas: "",
    StruggleWithFollowing: "",
    StruggleWithFollowingSelected: "",
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
    MilitaryCalisthenics: "",
    DrinkDaily: "",
    UsuallyGet: "",
    FollowDiets: ""
}
