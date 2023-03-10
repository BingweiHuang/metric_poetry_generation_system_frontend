// 自定义实例调用
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://1.12.62.89:8080',
    // baseURL: 'http://127.0.0.1:8000',
    // timeout: 1000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        // 'Content-Type': 'application/json;charset=UTF-8',
    },
    responseType: "json",
});

export {
    instance,
}
