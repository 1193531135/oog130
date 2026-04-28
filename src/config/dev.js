const sdkConfig = {
    webVersion: "-V171.043.2000.42", // 网页版本
    mixpanelwebVersion: "1.0.0",//main-page埋点版本号
    progectName: "oog104",
    defaultPriceGroup: "9BKFW",
    emailAddress: "liuchenglong@laien.io", //联系我们-公司邮箱地址
    fbqName: "test",
    ga4Name: 'test',
    ga4MeasurementID: 'G-D872RR3TG0',
    ga4DebugMode: true, //开启debuger模式
    paypalConfig: {
        clientId: 'AVqL5s5k0WQR46b1_Zrl1iSrHS3Zgpapf24o3fzT_3vqaTCl_uxvNT7bzbLYdt3eoQnkz3n_Pl09Nrvg', //PayPal 支付clientid
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
        //ageGroup页面设计design
        ageGroupDesignExperimentName: "landing_page_design_test_jan20th",
        ageGroupDesignParamName: "design",
        defaultAgeGroupDesignParam: 'default',
        selectAgeGroupDesignParam: 'test',
        //ageGroup图片
        ageGroupExperimentName: "oct29th_agegroup_experiment",
        ageGroupParamName: "age_group_id",
        defaultAgeGroupParam: 'age_group_1',
        selectAgeGroupParam: 'age_group_3',
        tier: 'development', // development ,production
    },
    firebaseConfig: {
        // apiKey: "AIzaSyASpCyzRmmwVlQUqG7G-ArJ31iogpM5auI",
        // authDomain: "test-project-33489.firebaseapp.com",
        // databaseURL: "https://test-project-33489.firebaseio.com",
        // projectId: "test-project-33489",
        // storageBucket: "test-project-33489.appspot.com",
        // messagingSenderId: "493620055150",
        // appId: "1:493620055150:web:38d916d82f3d07bb532a7f",
        // measurementId: "G-HZ5M6LL56P",
        apiKey: "AIzaSyBBQ95CoXStSm7nLhcSzWqDRXgtAR7YHbk",
        authDomain: "test2-8c745.firebaseapp.com",
        projectId: "test2-8c745",
        storageBucket: "test2-8c745.firebasestorage.app",
        messagingSenderId: "949166652519",
        appId: "1:949166652519:web:003842dc347687f61168c2",
        measurementId: "G-97B1MPDXPC",

        defaultCollectionPath: 'web2app'
    },
    apiConfig: {
        systemBaseUrl: 'https://backend-dev.7mfitness.com',
        stripeBaseUrl: 'https://api.revenuecat.com/v1',
    },
    stripeConfig: {
        revenuecatStripeAppPublicApiKey: "strp_CIcMXzWkHqlnUWwnGvotpNlmeAJ",
        stripeKey: "pk_test_51O5L81DOSX8YAb7RBP6pbsCt2Nyh9WJgmarDuYY7i25D9EXZQYc1s39FkSq3TOWUyFnKAaS0x1zM8BiVozEdsho300CTYNpxNj",
    },
    mixpanelConfig: {
        token: '905c2315470093926e258d9937dd60dd',
        onboardingEventKey: 'test_OB',
        homePageEventKey: 'test_1st',
        purchaseKey: 'test_OB'
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
        dsn: 'https://74225e934b3c865171a36b93cf4bae02@o4507304172388352.ingest.us.sentry.io/4508101837586432'
    }
}
export default sdkConfig
