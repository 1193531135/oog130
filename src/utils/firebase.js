// 参考文档：https://firebase.google.cn/docs/web/setup?hl=zh-cn
import webConfig from "@/config/index.js"
import { initializeApp } from 'firebase/app';
// import { mergeMixpanelInfo } from "@/utils/mixpanel"
// import store from "@/store";
// import utils from "./utils";
import {
    getAuth, signInAnonymously, EmailAuthProvider, linkWithCredential,
    signInWithEmailAndPassword, signOut,
    fetchSignInMethodsForEmail, updateEmail, onAuthStateChanged,
    updatePassword, sendPasswordResetEmail
} from "firebase/auth";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
let auth


//项目配置
const firebaseConfig = webConfig.firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
auth = getAuth();
let currentPath, currentPathUid;
let userOnAuthInfo = null;

let redirectPath = '/get-start-page';


//侦听器 监听用户登陆状态
onAuthStateChanged(auth, async (user) => {
    console.log("Auth state changed:", user);
    // 更新uid
    if (user && user.uid) {
        window.sessionStorage.setItem('uid', user.uid);
        userOnAuthInfo = user;
    }
    //正式账号登陆
    if (user && !user.isAnonymous) {
        try {
            // 更新用户信息到 Vuex Store 并处理分析数据
            // mergeMixpanelInfo(user.uid);
            // store.commit("updateuserInfo", user);
            // const userData = await getFirestoreDataByUid(user.uid);
            // if (userData?.isDeletedAccount) {
            //     // 用户账号被删除，退出登录并清除用户信息
            //     store.commit("updateuserInfo", null);
            //     await signOutWithEmail();
            // } else {
            //     // 更新用户信息到 Vuex Store 并处理分析数据
            //     mergeMixpanelInfo(user.uid);
            //     store.commit("updateuserInfo", user);
            // }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        //正式账号登陆过期返回登陆页面
        if (currentPath === '/user-profile-page') {
            // utils.routerReplace('/main-page')
        }
        // store.commit("updateuserInfo", null);
    }

});
// 重置页面权限
function resetPage() {
    window.sessionStorage.removeItem("onBoardingRecordInfo");
    window.sessionStorage.removeItem("paywallCountDownTime")
    window.sessionStorage.removeItem("paywallDiscountCountDownTime")
    if (currentPath == '/brand-page') {
        redirectPath = '/brand-page'
    } else if (currentPath == '/user-profile-page') {
        // store.commit("updateuserInfo", null);
        redirectPath = '/main-page';
    }
    // utils.routerReplace(redirectPath)

}
//获取路由参数
function getUrlParams(url) {
    const search = url.search;
    const params = new URLSearchParams(search);
    return params;
}
// 刷新idtoken--token过期为1小时过期 
export function refreshFirebaseToken(user = userOnAuthInfo) {
    if (user) {
        user.getIdToken().then((idToken) => {
            console.log("Refreshed token:", idToken);
        }).catch((error) => {
            console.error("Error refreshing token:", error);
        });
    }
}
// 删除用户token--用于测试，模拟token失效
export function deleteUserToken(user = userOnAuthInfo) {
    if (user) {
        user.delete().then((idToken) => {
            console.log("delete token:success");

        }).catch((error) => {
            console.log("delete token error:", error);

        });
    }
}

// 邮箱登陆
export function signInWithEmail(email, password) {
    return new Promise(function (resolve, reject) {
        signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
            resolve(user)
        }).catch(err => {
            console.log(err);

            reject(err)
        })
    })
}

//更新邮箱密码
export function updateEmailPassword(newPassword) {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        updatePassword(auth.currentUser, newPassword).then(res => {

            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
//发送邮件重置密码
export function sendEmailRestPassword(email) {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        sendPasswordResetEmail(auth, email).then(res => {
            resolve(true)
        }).catch(err => {
            console.log('发送邮件重置密码失败');
            reject(err)
        })
    })
}

//退出邮箱登陆
export async function signOutWithEmail(isClear = true) {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        signOut(auth).then(res => {
            if (isClear) {
                window.sessionStorage.removeItem("onBoardingRecordInfo");
                window.sessionStorage.removeItem("paywallCountDownTime")
                window.sessionStorage.removeItem("paywallDiscountCountDownTime")
            }
            resolve(true)
        }).catch(err => {
            reject(false)
        })
    })


}

// 更改邮箱
export async function updateEmailInfo(email) {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        updateEmail(auth.currentUser, email).then(res => {
            resolve(true)
        }).catch(err => {
            reject(err)
        })
    })

}
//通过邮箱验证账号是否为正式账号
export async function signInMethodsForEmail(email) {
    const auth = getAuth();
    return new Promise(function (resolve, reject) {
        fetchSignInMethodsForEmail(auth, email).then((signInMethods) => {
            resolve(signInMethods)
        }).catch(err => {
            reject([])
        })
    })
}


//创建模拟账号
export async function createAnonymousAccount() {
    const auth = getAuth(); // 确保 auth 已初始化
    try {
        let { user } = await signInAnonymously(auth);
        console.log('创建的匿名账号：' + user.uid);
        return user.uid; // 返回用户 UID
    } catch (error) {
        console.error('创建模拟账号，获取uid错误：', error);
        throw error; // 可选：重新抛出错误，方便调用方处理
    }
}
//获取匿名用户登陆状态
export function getAnonymousAuth() {
    const auth = getAuth();
    return auth.currentUser;
}
// 匿名账号转正式账号
// export async function createAccount(email, password) {
//     await hasExitedAnonymousAccount();
//     const auth = getAuth();
//     // 创建邮箱密码凭据
//     const credential = EmailAuthProvider.credential(email, password);
//     try {
//         const res = await linkWithCredential(auth.currentUser, credential);
//         console.log("匿名账号成功转化为正式账号：");
//         // await utils.sleep(25000);
//         return res;
//     } catch (err) {
//         console.error("匿名账号转正式账号失败：");
//         throw err; // 保持错误向上传递
//     }
// }

export async function createAccount(email, password) {
    let userAuth = getAuth();
    // 确保当前用户为匿名账号
    if (!userAuth.currentUser) {
        await createAnonymousAccount();
    }
    userAuth = getAuth();
    const credential = EmailAuthProvider.credential(email, password);
    return new Promise(function (resolve, reject) {
        linkWithCredential(userAuth.currentUser, credential).then(res => {
            resolve(res)
        }).catch(err => {
            console.log('匿名账号转正式账号失败：' + JSON.stringify(err));
            reject(err)
        })
    })
}



//获取集合类数据列表
export async function getFirestoreCollList(collectionPath = firebaseConfig.defaultCollectionPath) {
    hasExitedAnonymousAccount();
    try {
        const firestoreColection = collection(db, collectionPath);
        const snapshot = await getDocs(firestoreColection);
        const list = snapshot.docs.map(doc => doc.data());
        return list;
    } catch (error) {
        throw Error('获取firestore集合数据错误：' + error);
    }
}
// 通过documentId获取数据
export async function getFirestoreDataByUid(documentId, collectionPath = firebaseConfig.defaultCollectionPath) {
    await hasExitedAnonymousAccount();
    try {
        const docRef = doc(db, collectionPath, documentId);
        const docSnap = await getDoc(docRef);
        console.log('通过ducumenntId获取firestore数据');

        return docSnap.exists() ? docSnap.data() : null
    } catch (error) {
        throw Error('通过ducumenntId获取firestore数据错误：' + error);
    }
}
//firestore添加数据
export async function addFirestoreData(documentId, data, collectionPath = firebaseConfig.defaultCollectionPath) {
    await hasExitedAnonymousAccount();
    try {
        const documentRef = doc(db, collectionPath, documentId);
        await setDoc(documentRef, data);
    } catch (error) {
        throw Error(`${collectionPath}/${documentId}新增数据错误：` + error);
    }
}
//firestore修改数据
export async function updateFirestoreData(documentId, data, collectionPath = firebaseConfig.defaultCollectionPath) {
    return new Promise((resolve, reject) => {
        const documentRef = doc(db, collectionPath, documentId);
        updateDoc(documentRef, data).then(res => {
        }).catch(async error => {
            //文档数据未存在
            if (error.message.includes('No document to update')) {
                let onBoardingRecordInfo = window.sessionStorage.getItem('onBoardingRecordInfo');
                onBoardingRecordInfo = onBoardingRecordInfo ? Object.assign({}, JSON.parse(onBoardingRecordInfo), data) : data;
                await addFirestoreData(documentId, onBoardingRecordInfo)
            } else {
                reject(error)
            }
        })
    })
}

//firestore删除数据
export async function deleteFirestoreData(documentId, collectionPath = firebaseConfig.defaultCollectionPath) {
    await hasExitedAnonymousAccount();
    try {
        await deleteDoc(doc(db, collectionPath, documentId));
    } catch (error) {
        throw Error(`${collectionPath}/${documentId}删除数据错误：` + error);
    }
}
// 判断匿名账户登录状态
async function hasExitedAnonymousAccount() {
    let auth = getAuth();
    const userInfo = window.sessionStorage.getItem('userInfo')
    // 确保当前用户为匿名账号
    if (!auth.currentUser && !userInfo) {
        await createAnonymousAccount();
        console.log('创建了新的匿名账号:' + auth.currentUser);
    }
}
