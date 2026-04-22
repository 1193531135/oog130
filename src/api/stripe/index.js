import requestStripe from "@/network/stripe";
//刷新rc订单信息
export function receipts(app_user_id, fetch_token) {
    return requestStripe.post("/receipts", {
        app_user_id, fetch_token
    })
}
// 查询rc订单订阅信息
export function getSubscriber(appUserId) {
    return requestStripe.get(`/subscribers/${appUserId}`)
}
