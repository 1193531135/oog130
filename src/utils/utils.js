

const utils = {
    getUrlParams(url) {
        let pattern = /([\w%]+)=([^&]+)/g; // 修改正则表达式以支持特殊字符
        let parames = {}; // 定义参数对象
        url.replace(pattern, ($, $1, $2) => {
            parames[$1] = $2;
        });
        return parames;
    }
}
export default utils