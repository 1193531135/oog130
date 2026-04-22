import webConfig from "@/config/web.config";
let arr = webConfig.webVersion.split('.');
let version = arr[arr.length - 1];

export function setLocalStorageValue(key, value) {
    if (!value) return
    window.localStorage.setItem(webConfig.flowName + '-' + version + '-' + key, JSON.stringify(value))
}
export function getLocalStorageValue(key) {
    let res = window.localStorage.getItem(webConfig.flowName + '-' + version + '-' + key);
    if (res) {
        res = JSON.parse(res)
    }
    return res
}
export function removeLocalStorageValue(key) {
    window.localStorage.removeItem(webConfig.flowName + '-' + version + '-' + key)
}
//移除上一版本缓存
export function removeLastLocalStorageValue(key) {
    let lastVersion = JSON.parse(JSON.stringify(version)) * 1 - 1;
    lastVersion = lastVersion < 10 ? '0' + lastVersion : lastVersion + '';
    window.localStorage.removeItem(webConfig.flowName + '-' + lastVersion + '-' + key)
}

export function clearLocalStorageValue() {
    window.localStorage.clear()
}