import axios from 'axios'
import store from '../store/index';
import {ElMessage} from "element-plus";


// 刷新 access_token 的接口
const refreshToken = () => {
    return instance.post('api/token/refresh/', { refresh: store.getters.get_refresh })
}
// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // baseURL: 'http://1.12.62.89:8080',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
})
let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组
instance.interceptors.response.use(response => {
    return response
}, error => {
    if (!error.response) {
        return Promise.reject(error)
    }
    if (error.response.status === 401 && !error.config.url.includes('api/token/refresh/')) {
        const { config } = error
        if (!isRefreshing) {
            isRefreshing = true
            return refreshToken().then(res=> {
                const access_token = res.data.access
                // console.log("刷新token成功,res.data.access:", access_token)
                store.commit("set_access", access_token)
                config.headers.Authorization = `Bearer ${access_token}`
                // token 刷新后将数组的方法重新执行
                requests.forEach((cb) => cb(access_token))
                requests = [] // 重新请求完清空
                return instance(config)
            }).catch(err => {
                console.log('抱歉，您的登录状态已失效，请重新登录！')
                store.commit('clear_account')
                ElMessage({
                    showClose: true,
                    type: 'error',
                    message: '登录已超时，请重新登录！',
                    duration: 5000,
                })
                return Promise.reject(err)
            }).finally(() => {
                isRefreshing = false
            })
        } else {
            // 返回未执行 resolve 的 Promise
            return new Promise(resolve => {
                // 用函数形式将 resolve 存入，等待刷新后再执行
                requests.push(token => {
                    config.headers.Authorization = `Bearer ${token}`
                    resolve(instance(config))
                })
            })
        }
    }
    return Promise.reject(error)
})
// 给请求头添加 access_token
const setHeaderToken = (isNeedToken) => {
    const accessToken = isNeedToken ? store.getters.get_access : null
    if (isNeedToken) { // api 请求需要携带 access_token
        if (!accessToken) {
            console.log('不存在 access_token 则跳转回登录页')
            store.commit('clear_account')
            ElMessage({
                showClose: true,
                type: 'error',
                message: '您未登录，请先登录！',
                duration: 5000,
            })
        }
        instance.defaults.headers.Authorization = `Bearer ${accessToken}`
    }
}
// 有些 api 并不需要用户授权使用，则无需携带 access_token；默认不携带，需要传则设置第三个参数为 true
export const get = (url, params = {}, isNeedToken = false) => {
    setHeaderToken(isNeedToken)
    return instance({
        method: 'get',
        url,
        params,
    })
}
export const post = (url, params = {}, isNeedToken = false) => {
    setHeaderToken(isNeedToken)
    return instance({
        method: 'post',
        url,
        data: params
    })
}