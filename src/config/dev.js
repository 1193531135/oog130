const sdkConfig = {
    webVersion: "-V171.043.2000.42", // 网页版本
    mixpanelwebVersion: "1.0.0",//main-page埋点版本号
    emailAddress: "liuchenglong@laien.io", //联系我们-公司邮箱地址
    fbqName: "test",
    ga4Name: 'test',
    ga4MeasurementID: 'G-D872RR3TG0',
    ga4DebugMode: true, //开启debuger模式
    paypalConfig: {
        clientId: 'AYNPNwaTD4O2wdBiBxcqSLESrTPgTf6YQMK_2DEtoYwKq2C2xxfAXPxApW7BgbzPtuwa_qa2YWp_Hbur', //PayPal 支付clientid
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
        apiKey: "AIzaSyBZXcPnwsNj_JUQTErFUCxkLcYSrlopEPY",
        authDomain: "test1-7a74b.firebaseapp.com",
        projectId: "test1-7a74b",
        storageBucket: "test1-7a74b.appspot.com",
        messagingSenderId: "892668185998",
        appId: "1:892668185998:web:02ac71ff5bdae2bc9ae8df",
        measurementId: "G-648YM628PH"
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
        token: '1e39f8d80172d066f7ef852a64c88245',
        onboardingEventKey: 'test_OB',
        homePageEventKey: 'test_1st',
        purchaseKey: 'test_OB'
    },
    sentryConfig: {
        dsn: 'https://74225e934b3c865171a36b93cf4bae02@o4507304172388352.ingest.us.sentry.io/4508101837586432'
    }
}
export default sdkConfig