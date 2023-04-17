import axios from 'axios'
import store from '../store/index';
import {ElLoading, ElMessage} from "element-plus";

const LoadingInstance = {
    _target: null,
    _count: 0
};

// 刷新 access_token 的接口
const refreshToken = () => {
    return instance.post(system_base_url + 'api/token/refresh/', { refresh: store.getters.get_refresh })
}

export const system_base_url = 'http://127.0.0.1:8000/';
// export const system_base_url = '/sys/';
export const AI_base_url = 'http://127.0.0.1:8088/';
// export const AI_base_url = '/ai/';


export const trans_next_url = 'http://bwhlifetimelove.top/';


const indx2text = ['', '作诗中', '邮件发送中']

// 创建 axios 实例
const auth_instance = axios.create({
    // baseURL: 'http://1.12.62.89:8080',
    timeout: 20 * 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Authorization': "Bearer " + store.getters.get_access,
    }
})

auth_instance.interceptors.request.use(
    config => {

        // 创建loading实例
        if (auth_instance.defaults.headers.Loading > 0) {
            const idx = auth_instance.defaults.headers.Loading
            LoadingInstance._count++;
            if(LoadingInstance._count === 1) {
                LoadingInstance._target = ElLoading.service({text: indx2text[Number(idx)]});
            }
        }

        // 携带token验证
        config.headers.Authorization = "Bearer " + store.getters.get_access;

        if (config.url.includes(trans_next_url)) {
            config.url = config.url.replace(trans_next_url, system_base_url)
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
let isRefreshing = false // 标记是否正在刷新 token
let requests = [] // 存储待重发请求的数组
auth_instance.interceptors.response.use(
    response => {
    (auth_instance.defaults.headers.Loading > 0) && closeLoading() // 关闭loading
    if (response.data.result && response.data.result !== '') {
        ElMessage({
            showClose: true,
            type: 'success',
            message: response.data.result,
            duration: 3000,
        })
    }
    return response
},
    error => {

    auth_instance.defaults.headers.Loading && closeLoading() // 关闭loading
    if (error.message && error.message.includes('timeout')) {
        ElMessage({
            showClose: true,
            type: 'error',
            message: '请求超时！',
            duration: 3000,
        })
    }
    else if (error.message && error.message.includes('Network')) {
        const message = window.navigator.onLine ? '服务器端异常！' : '您断网了！';
        ElMessage({
            showClose: true,
            type: 'error',
            message,
            duration: 3000,
        })
    }
    else if (error.response.status && error.response.status === 401) {
        // 是需要token验证的请求
        if (!error.config.url.includes('api/token/refresh/')) {
            // 没有token（没登陆过）
            if (store.getters.get_access === '') {
                if (!error.config.url.includes('account/login/')) {
                    ElMessage({
                        showClose: true,
                        type: 'error',
                        message: '您未登录，请先登录！',
                        duration: 3000,
                    })
                }
                // return Promise.reject(error)
            } else { // 有token （登陆token过期后的请求）
                const { config } = error
                if (!isRefreshing) {
                    isRefreshing = true
                    return refreshToken().then(res=> { // 用refresh刷新 token
                        const access_token = res.data.access
                        store.commit("set_access", access_token)
                        config.headers.Authorization = `Bearer ${access_token}`
                        // token 刷新后将数组的方法重新执行
                        requests.forEach((cb) => cb(access_token))
                        requests = [] // 重新请求完清空
                        return auth_instance(config)
                    }).catch(err => {
                        if (err.response.status === 401) {
                            store.commit('clear_account')
                            ElMessage({
                                showClose: true,
                                type: 'error',
                                message: '登录已超时，请重新登录！',
                                duration: 3000,
                            })
                        }
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
                            resolve(auth_instance(config))
                        })
                    })
                }
            }
        } /*else {
            return Promise.reject(error)
        }*/
    } else {
        httpErrorStatusHandle(error)
        // return Promise.reject(error)
    }
    return Promise.reject(error)
}
)

const instance = axios.create({
    // baseURL: 'http://1.12.62.89:8080',
    timeout: 20 * 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})
instance.interceptors.request.use(
    config => {

        // 创建loading实例

        if (instance.defaults.headers.Loading > 0) {
            const idx = instance.defaults.headers.Loading
            LoadingInstance._count++;
            if(LoadingInstance._count === 1) {
                LoadingInstance._target = ElLoading.service({text: indx2text[Number(idx)]});
            }
        }
        // config.headers["Content-Type"] = 'application/x-www-form-urlencoded';

        if (config.url.includes(trans_next_url)) {
            config.url = config.url.replace(trans_next_url, system_base_url)
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)
instance.interceptors.response.use(
    response => {
        (instance.defaults.headers.Loading > 0) && closeLoading() // 关闭loading
        if (response.data.result && response.data.result !== '') {
            ElMessage({
                showClose: true,
                type: 'success',
                message: response.data.result,
                duration: 3000,
            })
        }
        return response
    },
    error => {

        instance.defaults.headers.Loading && closeLoading() // 关闭loading
        if (error.message && error.message.includes('timeout')) {
            ElMessage({
                showClose: true,
                type: 'error',
                message: '请求超时！',
                duration: 3000,
            })
        }
        else if (error.message && error.message.includes('Network')) {
            const message = window.navigator.onLine ? '服务器端异常！' : '您断网了！';
            ElMessage({
                showClose: true,
                type: 'error',
                message,
                duration: 3000,
            })
        }
        else {
            httpErrorStatusHandle(error)
        }
        return Promise.reject(error)
    }
)

function closeLoading() {
    if(LoadingInstance._count > 0) LoadingInstance._count--;
    if(LoadingInstance._count === 0) {
        LoadingInstance._target.close();
        LoadingInstance._target = null;
    }
}

const httpErrorStatusHandle = (error) => {
    let message = '';
    const dict = error.response.data;
    switch(error.response.status) {
        case 302: message = '接口重定向了！';break;
        // case 400: message = '参数不正确！';break;
        case 400:
            for (const key in dict) {
                message += dict[key] + '\n';
            }
            break;
        // case 401: message = '您未登录，或者登录已经超时，请先登录！';break;
        case 403: message = '您没有权限操作，请联系管理员。'; break;
        case 404: message = `请求地址出错: ${error.response.config.url}`; break; // 在正确域名下
        case 408: message = '请求超时！'; break;
        case 409: message = '系统已存在相同数据！'; break;
        case 429: message = '系统限流！'; break;
        case 500: message = error.response.data.result ? error.response.data.result : '服务器内部错误！'; break;
        case 501: message = '服务未实现！'; break;
        case 502: message = '网关错误！'; break;
        case 503: message = '服务不可用！'; break;
        case 504: message = '服务暂时无法访问，请稍后再试！'; break;
        case 505: message = 'HTTP版本不受支持！'; break;
        // default: message = '异常问题，请联系管理员！'; break
    }

    if (message !== '') {
        ElMessage({
            showClose: true,
            type: 'error',
            message,
            duration: 3000,
        })
    }
}

// 需要用户授权使用，携带access_token。
export const authGet = (url, params = {}, Loading = 0) => {
    auth_instance.defaults.headers.Loading = Loading
    return auth_instance({
        method: 'get',
        url,
        params,
    })
}
export const authPost = (url, params = {}, Loading = 0) => {
    auth_instance.defaults.headers.Loading = Loading
    return auth_instance({
        method: 'post',
        url,
        data: params
    })
}

export const authPut = (url, params = {}, Loading = 0) => {
    auth_instance.defaults.headers.Loading = Loading
    return auth_instance({
        method: 'put',
        url,
        data: params
    })
}

export const authDelete = (url, params = {}, Loading = 0) => {
    auth_instance.defaults.headers.Loading = Loading
    return auth_instance({
        method: 'delete',
        url,
        params,
    })
}

// 需要用户授权使用，携带access_token。
export const Get = (url, params = {}, Loading = 0) => {
    instance.defaults.headers.Loading = Loading
    return instance({
        method: 'get',
        url,
        params,
    })
}
export const Post = (url, params = {}, Loading = 0) => {
    instance.defaults.headers.Loading = Loading
    return instance({
        method: 'post',
        url,
        data: params
    })
}

export const Put = (url, params = {}, Loading = 0) => {
    instance.defaults.headers.Loading = Loading
    return instance({
        method: 'put',
        url,
        data: params
    })
}

export const Delete = (url, params = {}, Loading = 0) => {
    instance.defaults.headers.Loading = Loading
    return instance({
        method: 'delete',
        url,
        params,
    })
}