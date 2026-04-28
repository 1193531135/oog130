const sdkConfig = {
    webVersion: "-V171.043.2000.44", //  网页版本
    mixpanelwebVersion: "1.0.0",//main-page埋点版本号
    progectName: "oog104",
    defaultPriceGroup: "9BKFW",
    emailAddress: "contact-us@7mfitness.com", //联系我们-公司邮箱地址
    fbqName: "",
    ga4Name: '',
    ga4MeasurementID: 'G-HDXWJXPQCM',
    ga4DebugMode: false, //开启debuger模式
    paypalConfig: {
        clientId: 'AW70NPuxsiEboT3BBmeqEW43brh4JNsCaCHjVG7Ck2WS_7UKZtYuJRNF9aMxmIKXraAYb_WfUT2l2Vdz', //PayPal 支付clientid
    },
    statsigConfig: {
        statsigClientKey: 'client-pit9UptOZp4pl3qWvJnoh02qce3S2Hw1ldHZrXvu72x',
        //paywall
        paywallExperimentName: "sep24th_paywallcombooptimization_experiment",
        paywallParamName: "flow_version",
        defaultPaywallParam: 'base',
        selectPaywallParam: 'new',
        //price:control_price (我们当前的价格);reduced_price (降价);increased_price (涨价)
        priceExperimentName: "nov01th_paywallprice_experiment",
        priceParamName: "pricing_tier",
        defaultPriceParam: 'control_price',
        selectPriceParam: 'reduced_price',
        //下载二维码和深链接
        cppParameterExperimentName: "dec16th_cpp_experiment",
        cppParameterParamName: "cpp_parameter",
        defaultCppParameterParam: 'base',
        selectCppParameterParam: 'new',
        //ageGroup页面设计design A/B实验
        ageGroupDesignExperimentName: "landing_page_design_test_jan20th",
        ageGroupDesignParamName: "design",
        defaultAgeGroupDesignParam: 'default',
        selectAgeGroupDesignParam: 'test',
        //ageGroup图片
        ageGroupExperimentName: "oct29th_agegroup_experiment",
        ageGroupParamName: "age_group_id",
        defaultAgeGroupParam: 'age_group_1',
        selectAgeGroupParam: 'age_group_3',
        tier: 'production', // development ,production
    },
    apiConfig: {
        systemBaseUrl: 'https://furina.7mfitness.com',
        stripeBaseUrl: 'https://api.revenuecat.com/v1',
    },
    firebaseConfig: {
        apiKey: "AIzaSyDyZmiTUp5d71LfN4Hbyo0lKzh0t0H-dUg",
        authDomain: "oog126---tai-chi-for-beginners.firebaseapp.com",
        projectId: "oog126---tai-chi-for-beginners",
        storageBucket: "oog126---tai-chi-for-beginners.firebasestorage.app",
        messagingSenderId: "985747364944",
        appId: "1:985747364944:web:0b080adb0934029f238555",
        measurementId: "G-HXZHP15BS4",
        defaultCollectionPath: 'web2app',
    },
    stripeConfig: {
        revenuecatStripeAppPublicApiKey: "strp_BfIdOSUqjdxNacFnNCUoVCzJKIt",
        stripeKey: "pk_live_51O5L81DOSX8YAb7RgMgytMC7ddW6L3CLBm5FOMAX8xh00VbRiqTvrM4YDdjz2kqZgRjRL528hXMmgMXdzykOTnoZ00ws1Rin9J",
    },
    mixpanelConfig: {
        token: '8e421c1766dbac58409eaa3453dbefeb',
        onboardingEventKey: 'OB',
        homePageEventKey: '1st',
        purchaseKey: 'OB',
    },
    systemApiVersion: {
        sendTempMail: "v1",
        sendContactUsEmail: "v1",
        getSubscriptionList: "v1",
        getPriceList: "v4",
        createCheckoutSessionEmbedded: "v3",
        createCheckoutPaypalSession: "v3",
        synchPaypalSubscription: "v1",
        getSubscriptionInfo: "v1",
        getPaypalSubscriptionInfo: "v1",
        cancelSubscription: "v1",
        transferSubscription: "v3",
        resumeSubscriptionInfo: "v1",
        mergeMixpanelData: "v1",
        getPayPlatformName: "v1"
    },
    sentryConfig: {
        dsn: 'https://2aa5bb6af04c3cea03e69fbbb16b08dd@o4507304172388352.ingest.us.sentry.io/4508436024197120'
    }
}
export default sdkConfig
