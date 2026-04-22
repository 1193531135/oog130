
import moment from "moment";
import webConfig from "@/config/index.js";
import keywordConfig from "@/config/onboarding.config/keyword.json"
import router from "@/router";
import webLanguage from "@/config/language/webLanguage"
import mainConfig from "@/config/onboarding.config/main.json"
import Vue from "vue";

const utils = {
    initFt: 30.48,
    initIn: 2.54,
    initLbs: 0.45359237,
    initUnderweight: 18.5,
    initNormal: 25,
    initOverweight: 30,

    //禁用浏览器返回事件
    disableBrowserBack() {
        history.pushState(null, null, window.location.href);
    },
    // 监听输入框value变化
    inputValueWatch(newValue, oldValue, maxNumber = 9) {
        if (newValue == '') return 0
        if (oldValue == 0) newValue = newValue * 1
        let res = 0
        let str = (newValue + '').split('.');
        if ((newValue + '').includes('.')) {
            res = oldValue

        } else {
            res = Number(newValue) > maxNumber ? oldValue : newValue
        }
        return res
    },
    //数字格式化：有小数点取到小数点 ，整数不显示小数点
    formatNumber(num, fixedNumber = 1) {
        if (num) {
            num = num * 1;
            num = num.toFixed(fixedNumber);
            return num % 1 === 0 ? Math.round(num) : num;
        }
        return 0
    },

    // kg转英镑
    kgToLbs(kg, min = 0, max = 0, number = 1) {

        if (!kg) return 0;
        let res = utils.formatNumber((kg / utils.initLbs), number);
        if (min && res < min) {
            res = min
        }
        if (max && res > max) {
            res = max
        }
        return res
    },
    // 英镑转kg
    lbsToKg(lbs, min = 0, max = 0, number = 1) {

        if (!lbs) return 0;
        let res = utils.formatNumber((utils.initLbs * lbs), number);
        if (min && res < min) {
            res = min
        }
        if (max && res > max) {
            res = max
        }
        return res
    },
    // 时间格式化
    getDate(date, format = "MM/DD/YYYY") {
        if (!date) return '';
        moment.locale(Vue.prototype.$language);
        return moment(new Date(date)).format(format)
    },
    // 时间戳转格式
    formattedDate(timestamp, format = 'MMM DD,YYYY') {
        if (!timestamp) return
        return moment(timestamp).format(format);
    },

    // 日期转时间戳
    formatTimestamp(date) {
        const parsedDate = new Date(date);
        // 验证日期是否有效
        return isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
        // if (!date) return
        // date = moment(date);
        // // 转换为时间戳（毫秒）
        // return date.valueOf();
    },
    // 两个时间日期的时间差（毫秒差）
    momentDifference(time1, time2, unit = '') {
        time1 = moment(time1)
        time2 = moment(time2)
        return time2.diff(time1, unit); // 默认返回毫秒
    },
    //计算num个月后的时间
    getAnyMonth(n, format = "MM/DD/YYYY") {
        const now = moment();
        return utils.getDate(now.add(n, 'months'), format)
    },
    // 获取n天后的日期
    getAnyDay(n, format = "MM/DD/YYYY") {
        const today = new Date();
        today.setDate(today.getDate() + n);
        return utils.getDate(today, format);
    },
    //获取bmi值：BMI=体重(kg)/身高(m)^2
    calculateBMI(height, weight) {
        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100; // 将身高转换为米
            const bmi = weight / (heightInMeters ** 2);
            return utils.formatNumber(bmi);
        }
        return '';
    },
    // 邮箱格式验证
    emailValidate(email) {
        let reg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
        return reg.test(email)
    },
    //密码验证
    passwordValidate(password) {
        let reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,30}$/
        return reg.test(password)
    },
    //首字母转大写
    apitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    // 文本替换关键词
    redirectUrlKeyword(str) {
        // 获取应用名
        str = utils.getAppName(str);

        // 获取当前关键字，默认为默认关键字
        let k = router.currentRoute.query.k || webConfig.defaultUrlKeyword;
        // 从白名单中检查当前关键字，若不在白名单中则使用默认关键字
        const validKeyword = webConfig.urlKeywordWhitelist.includes(k) ? k : webConfig.defaultUrlKeyword;

        // 通过 URL 获取匹配的关键字配置
        const matchedKeyword = keywordConfig.keywordList.find(item => item.k === String(validKeyword));

        // 如果找到匹配的关键字，则继续处理
        if (matchedKeyword && matchedKeyword.keyword) {
            const key = matchedKeyword.keyword.replace(/\s+/g, '');  // 去掉空格
            const keywordInfo = keywordConfig[webLanguage]?.[key];  // 根据当前语言获取关键词信息
            const caseSensitive = keywordConfig[webLanguage]?.caseSensitive;  // 获取是否区分大小写的设置
            const keywordType = utils.extractKeyword(str);  // 提取keyword变量类型

            // 如果存在翻译信息，则继续替换
            if (keywordInfo) {
                const newUrlKeyword = caseSensitive
                    ? utils.formatKeyword(keywordInfo, keywordType)  // 根据需要格式化翻译
                    : keywordConfig[webLanguage]?.[key];  // 否则使用默认的值

                if (newUrlKeyword) {
                    str = str.replace(/\${keyword[1-4]}/g, newUrlKeyword);  // 替换掉原始的关键字
                }
            }
        }

        return str;
    },

    // 提取keyword变量
    extractKeyword(str) {
        // 使用正则表达式提取 `${keyword1}` 中的 'keyword1'
        const regex = /\${(\w+)}/;
        const match = str.match(regex);

        // 如果匹配成功，返回提取的变量名；否则返回 ''
        return match ? match[1] : '';
    },
    // keyword关键词大小写转换
    formatKeyword(keyword, type) {
        // 常见介词列表，保持小写
        const prepositions = ['de', 'in', 'on', 'at', 'for', 'with', 'and', 'to', 'by', 'from', 'as'];
        // 辅助函数：将首字母大写，其他字母小写
        const capitalizeFirstLetter = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        // 辅助函数：将字符串转换为“标题大小写”（首字母大写，介词小写）
        const toTitleCase = (keyword) => keyword.split(' ').map(word => prepositions.includes(word.toLowerCase()) ? word : capitalizeFirstLetter(word)).join(' ');
        // 辅助函数：将字符串转换为大写
        const toUpperCase = (keyword) => keyword.toUpperCase();
        // 辅助函数：将字符串转换为小写
        const toLowerCase = (keyword) => keyword.toLowerCase();
        // 根据类型获取结果
        switch (type) {
            // 每个词的首字母大写，除某些介词外
            case 'keyword':
                keyword = toTitleCase(keyword);
                break;
            // keyword1: 所有字母大写
            case 'keyword1':
                keyword = toUpperCase(keyword);
                break;
            // keyword2: 将首字母大写，其他字母小写
            case 'keyword2':
                keyword = capitalizeFirstLetter(keyword);
                break;
            // keyword3: 所有字母小写
            case 'keyword3':
                keyword = toLowerCase(keyword);
                break;
            // 每个词的首字母大写，除某些介词外
            case 'keyword4':
                keyword = toTitleCase(keyword);
                break;
            default:
                return keyword;
        }
        return keyword;
    },

    getUrlParams(url) {
        let pattern = /([\w%]+)=([^&]+)/g; // 修改正则表达式以支持特殊字符
        let parames = {}; // 定义参数对象
        url.replace(pattern, ($, $1, $2) => {
            parames[$1] = $2;
        });
        return parames;
    },
    // 自定义路由跳转
    routerReplace(path, params) {
        utils.customRouterNavigate(path, true, params);
    },
    routerPush(path, params) {
        utils.customRouterNavigate(path, false, params);
    },
    //路由跳转
    customRouterNavigate(path, replace, params = {}) {
        //除当前路由外移除当前url参数
        const pathObj = {
            policyType: '/policy-page',
            paymentSuccess: '/create-account-page',
            isPay: '/paywall-page'
        }
        const urlParams = utils.getUrlParams(window.location.href);
        console.log(urlParams);
        let query = JSON.parse(window.sessionStorage.getItem('urlQuery')) || {};
        query = Object.assign(query, urlParams, params);
        for (let key in pathObj) {
            if (pathObj[key] != path) {
                delete query[key];
            }
        }
        if (path === '/user-profile-page') {
            delete query.anonymousId;
            if (query.chooseAProgram) {
                ['chooseAProgram', 'uid'].forEach(key => delete query[key]);
            }
        }
        if (replace) {
            router.replace({
                path,
                query,
            })
        } else {
            router.push({
                path,
                query,
            })
        }
    },
    getAppName(str = '') {
        return str = str.replace(/\${appName}/g, mainConfig.appName);//全大写 空格
    },
    //文本替换变量
    replaceTextValue(str, value1, value2, value3, value4) {
        //str:文本 value1:数量 value2:周期（周/月） value3:原价 value4:支付的价格
        str = str.replace(/\${keyword1}/g, value1);//全大写 空格
        str = str.replace(/\${keyword2}/g, value2);// 第一个字母大写 空格
        str = str.replace(/\${keyword3}/g, value3);// 全小写 空格
        str = str.replace(/\${keyword4}/g, value4); // 全首字母大写 空格
        return str
    },
    // 获取映射表别名
    getKey(key) {
        return webConfig.onBoardingKey[key] ? webConfig.onBoardingKey[key] : key
    },
    getDisplayWeight(weight, weightUnit) {
        const { weightType, weightKgUnitNumber } = webConfig;
        let convertedWeight;
        // 判断当前单位是否是 kg
        if (weightUnit === weightKgUnitNumber) {
            // 如果存储的值类型是 kg，直接使用 weight，否则将 lbs 转换为 kg
            convertedWeight = weightType === 0 ? weight : utils.lbsToKg(weight);
        } else {
            // 如果单位是 lbs，且存储的值类型是 kg，则将 kg 转换为 lbs，否则直接使用 weight
            convertedWeight = weightType === 0 ? utils.kgToLbs(weight) : weight;
        }
        // 根据传入的单位决定后缀是 'kg' 还是 'lbs'
        const unitLabel = weightUnit === weightKgUnitNumber ? 'kg' : 'lbs';
        return `${convertedWeight}${unitLabel}`;
    },
    //生成16位uuid
    generateUUID() {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    // 设置 body 的 overflow 设置方法
    setBodyOverflow(value) {
        document.body.style.overflow = value;
    },
    // 模版图片预加载
    templateImgLoad(config, fileName = '') {

        let imgList = [];
        // 合并 mainImage 和 imageList
        if (config.mainImage) {
            imgList.push(config.mainImage);
        }
        if (Array.isArray(config.imageList) && config.imageList.length) {
            imgList = imgList.concat(config.imageList);  // 直接合并
        }
        // 如果有图片列表则加载
        imgList.forEach((imgName) => {
            try {
                const src = require(`@/assets/image/template/${fileName}${imgName}`); // 使用 require 动态加载
                const image = new Image();
                image.src = src;
            } catch (error) {
                console.error(`Failed to load image: ${imgName}`, error); // 错误处理
            }
        });
    },
    //模版选项分组图片预加载
    allTemplateImgLoad(config, fileName = '') {
        for (const key in config) {
            const templateConfig = config[key];
            if (templateConfig && templateConfig.screenName) {
                utils.templateImgLoad(templateConfig, fileName);
            }

        }
        utils.templateImgLoad(config, fileName = '');// 加载默认分组
    },

    // 同步延迟等待
    sleep(ms = 3000) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    //价格分组ab测试：文档链接：https://laientech.feishu.cn/wiki/NrT1whEPvikbjjkbTzecBuQ2n7f?from=from_copylink
    getPriceGroup(priceGroup) {
        const priceGroupWhiteList = webConfig.priceGroupWhiteList; // 价格分组白名单
        const defaultPriceGroup = webConfig.defaultPriceGroup; // 默认价格分组
        return priceGroupWhiteList.includes(priceGroup) ? priceGroup : defaultPriceGroup;
    },
    //价格分组ab测试埋点
    getMixpanelPriceGroup(priceGroup) {
        const mixpanelPriceGroupWhiteList = webConfig.mixpanelPriceGroupWhiteList; // 价格分组白名单
        const defaultMixpanelPriceGroup = webConfig.defaultMixpanelPriceGroup; // 默认价格分组
        return mixpanelPriceGroupWhiteList.includes(priceGroup) ? priceGroup : defaultMixpanelPriceGroup;
    },

    //获取折扣比例 临时定义 后面由后端管理
    getDiscount(type) {
        const { lpid } = utils.getUrlParams(window.location.href);
        const priceGroup = utils.getPriceGroup(lpid)
        // 折扣比例映射表
        const discountMap = {
            "9BKFW": { discount: "61%", furtherDiscount: "71%" },
            "UK83Q": { discount: "71%", furtherDiscount: "81%" },
            "O2MGB": { discount: "81%", furtherDiscount: "91%" }
        };
        // 返回对应的折扣比例
        return discountMap[priceGroup][type];
    },
    /**
     * 根据上次选择的选项和当前屏幕名称处理最后的选择
     * @param {Array|Object} lastSelectedOptions 上次选择的选项，可以是单个选项或选项数组
     * @param {string} currentScreenName 当前屏幕名称，用于查找对应的规则
     * @param {Object} templateData 模板数据，根据规则选择相应的文本变化
     * @returns {Object} 返回根据规则选择的文本变化后的模板数据或原始模板数据
     */
    processLastSelection(lastSelectedOptions, currentScreenName, templateData) {
        // 如果没有上次的选择选项，则直接返回模板数据
        if (!lastSelectedOptions) return templateData;
        // 如果上次选择的选项不是数组，则将其转换为数组
        if (!Array.isArray(lastSelectedOptions)) {
            lastSelectedOptions = [lastSelectedOptions]; // 如果是单选转为数组形式
        }
        // 创建一个集合，用于快速查找上次选择的选项
        const selectedSet = new Set(lastSelectedOptions);
        // 获取当前屏幕名称对应的规则
        const questionRules = mainConfig.TextVariationRules?.[currentScreenName];
        // 如果没有规则，则直接返回模板数据
        if (!questionRules) return templateData;
        // 遍历规则，找到第一个匹配的规则
        const matchingRule = questionRules.find(rule => {
            // 检查规则的条件，看是否有满足的条件集合
            return rule.conditions.some(conditionSet => {
                // 转换条件集合为集合对象
                const conditionSetObj = new Set(conditionSet);
                // 判断条件集合与上次选择的选项集合是否精确匹配
                return conditionSetObj.size === selectedSet.size &&
                    [...conditionSetObj].every(item => selectedSet.has(item));
            });
        });
        // 根据匹配的规则返回相应的文本变化后的模板数据或原始模板数据
        return templateData?.[matchingRule?.nextTextVariation] || templateData;
    }








}
export default utils