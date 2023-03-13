// import $ from 'jquery';
import {instance} from "@/utils/utils";
import jwt_decode from 'jwt-decode';

const ModuleAccount = {
    state: {
        id: JSON.parse(localStorage.getItem('account')) === null ? 0 : JSON.parse(localStorage.getItem('account')).id,
        username: JSON.parse(localStorage.getItem('account')) === null ? "" : JSON.parse(localStorage.getItem('account')).username,
        // photo: JSON.parse(localStorage.getItem('account')) === null ? "" : JSON.parse(localStorage.getItem('account')).photo,
        followerCount: JSON.parse(localStorage.getItem('account')) === null ? 0 : JSON.parse(localStorage.getItem('account')).followerCount,
        access: JSON.parse(localStorage.getItem('account')) === null ? "" : JSON.parse(localStorage.getItem('account')).access,
        refresh: JSON.parse(localStorage.getItem('account')) === null ? "" : JSON.parse(localStorage.getItem('account')).refresh,
        is_login: JSON.parse(localStorage.getItem('account')) === null ? false : JSON.parse(localStorage.getItem('account')).is_login,
    },
    getters: {
    },
    mutations: {
        updateAccount(state, account) {
            localStorage.setItem('account', JSON.stringify(account)); // 将用户信息存入
            state.id = account.id;
            state.username = account.username;
            // state.photo = account.photo;
            state.followerCount = account.followerCount;
            state.access = account.access;
            state.refresh = account.refresh;
            state.is_login = account.is_login;
        },
        updateAccess(state, data) {
            const account = JSON.parse(localStorage.getItem('account')); // 获取用户信息
            account.access = data.access;  // 修改
            localStorage.setItem('account', JSON.stringify(account));  // 存入
            state.access = data.access;
        },
        logout(state) {
            localStorage.clear(); // 清空用户信息
            state.id = "";
            state.username = "";
            // state.photo = "";
            state.followerCount = 0;
            state.access = "";
            state.refresh = "";
            state.is_login = false;
        }
    },
    actions: {
        login(context, data) {

            /*instance({
                url: 'api/token/',
                method: "POST",
                data: {
                    username: data.username,
                    password: data.password,
                },
            })*/

            instance({
                url: 'account/login',
                method: "POST",
                data: {
                    username: data.email,
                    password: data.password,
                },
            })

            .then((resp) => {

                console.log(resp.data)

                const {access, refresh} = resp.data;
                const access_obj:any = jwt_decode(access);
                setInterval(() => {
                    instance({
                        url: "api/token/refresh/",
                        method: "POST",
                        data: {
                            refresh,
                        },
                    }).then((resp) => {
                        context.commit('updateAccess', resp.data.access);
                    })
                }, 4.5 * 60 * 1000);

                instance({
                    url: "account/get_info",
                    method: "GET",
                    params: {
                        user_id: access_obj.user_id,
                    },
                    headers: {
                        'Authorization': "Bearer " + access,
                    },
                }).then((resp) => {
                    context.commit("updateAccount", {
                        ...resp.data,
                        access: access,
                        refresh: refresh,
                        is_login: true,
                    });
                    data.success();
                });
            }).catch((error) => {
                console.log(error);
                data.error();
            });
        },
    },
    modules: {
    }
};

export default ModuleAccount;
