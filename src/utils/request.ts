import axios from 'axios'
import store from '../store/index';
import {ElLoading, ElMessage} from "element-plus";

const LoadingInstance = {
    _target: null,
    _count: 0
};

// 刷新 access_token 的接口
const refreshToken = () => {
    return instance.post('api/token/refresh/', { refresh: store.getters.get_refresh })
}
// 创建 axios 实例
const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    // baseURL: 'http://1.12.62.89:8080',
    timeout: 15 * 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
})

const indx2text = ['', '作诗中']

instance.interceptors.request.use(
    config => {

        // 创建loading实例

        if (instance.defaults.headers.Loading) {
            const idx = instance.defaults.headers.Loading
            LoadingInstance._count++;
            if(LoadingInstance._count === 1) {
                LoadingInstance._target = ElLoading.service({text: indx2text[Number(idx)]});
            }
        }
        config.headers["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
        // 携带token验证
        if (!config.headers.Authorization && store.getters.get_access !== '') {
            // console.log('store.getters.get_access:',store.getters.get_access)
            config.headers.Authorization = "Bearer " + store.getters.get_access;
        }

        // console.log('config',config)

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组
instance.interceptors.response.use(response => {
    instance.defaults.headers.Loading && closeLoading() // 关闭loading

    return response
}, error => {

    instance.defaults.headers.Loading && closeLoading() // 关闭loading
    if (error.message && error.message.includes('timeout')) {
        ElMessage({
            showClose: true,
            type: 'error',
            message: '服务器太拉，压力大。请求超时！',
            duration: 5000,
        })
    }
    else if (error.message && error.message.includes('Network')) {
        const message = window.navigator.onLine ? '服务端异常！' : '您断网了！';
        ElMessage({
            showClose: true,
            type: 'error',
            message,
            duration: 5000,
        })
    }
    else if (error.response.status && error.response.status === 401) {
        if (!error.config.url.includes('api/token/refresh/')) {
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
    } else {
        httpErrorStatusHandle(error)
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

function closeLoading() {
    if(LoadingInstance._count > 0) LoadingInstance._count--;
    if(LoadingInstance._count === 0) {
        LoadingInstance._target.close();
        LoadingInstance._target = null;
    }
}

const httpErrorStatusHandle = (error) => {
    let message = '';

    switch(error.response.status) {
        case 302: message = '接口重定向了！';break;
        case 400: message = '参数不正确！';break;
        // case 401: message = '您未登录，或者登录已经超时，请先登录！';break;
        case 403: message = '您没有权限操作！'; break;
        case 404: message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
        case 408: message = '请求超时！'; break;
        case 409: message = '系统已存在相同数据！'; break;
        case 500: message = '服务器内部错误！'; break;
        case 501: message = '服务未实现！'; break;
        case 502: message = '网关错误！'; break;
        case 503: message = '服务不可用！'; break;
        case 504: message = '服务暂时无法访问，请稍后再试！'; break;
        case 505: message = 'HTTP版本不受支持！'; break;
        default: message = '异常问题，请联系管理员！'; break
    }

    if (message !== '') {
        ElMessage({
            showClose: true,
            type: 'error',
            message,
            duration: 5000,
        })
    }

}

// 有些 api 并不需要用户授权使用，则无需携带 access_token；默认不携带，需要传则设置第三个参数为 true
export const get = (url, params = {}, isNeedToken = false, Loading = 0) => {
    setHeaderToken(isNeedToken)
    instance.defaults.headers.Loading = Loading
    const ret = instance({
        method: 'get',
        url,
        params,
    })
    return ret
}
export const post = (url, params = {}, isNeedToken = false) => {
    setHeaderToken(isNeedToken)
    return instance({
        method: 'post',
        url,
        data: params
    })
}