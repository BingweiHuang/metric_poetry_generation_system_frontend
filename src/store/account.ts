// import $ from 'jquery';
import {authGet, Post, system_base_url} from "@/utils/request";
import jwt_decode from 'jwt-decode';
import {ElMessage} from "element-plus";

const ModuleAccount = {
    state: {
        account: JSON.parse(localStorage.getItem('account')),
        access: JSON.parse(localStorage.getItem('access')) === null ? "" : JSON.parse(localStorage.getItem('access')),
        refresh: JSON.parse(localStorage.getItem('refresh')) === null ? "" : JSON.parse(localStorage.getItem('refresh')),
        is_login: (JSON.parse(localStorage.getItem('account')) !== null),
    },
    getters: {
        get_access(state) {
            return state.access
        },
        get_refresh(state) {
            return state.refresh
        },
        get_account(state) {
            return state.account
        },
        get_is_login(state) {
            return state.is_login
        },
    },
    mutations: {

        clear_account(state) {
            localStorage.clear(); // 清空用户信息
            state.access = "";
            state.refresh = "";
            state.is_login = false;
        },

        set_account(state, account) {
            localStorage.setItem('account', JSON.stringify(account)); // 将用户信息存入
            state.account = account;
            state.is_login = true;
        },

        set_access(state, access) {
            state.access = access;
            localStorage.setItem('access', JSON.stringify(access));
        },

        set_refresh(state, refresh) {
            state.refresh = refresh;
            localStorage.setItem('refresh', JSON.stringify(refresh));
        },

    },
    actions: {
        login(context, data) {

            Post(system_base_url + 'account/login/', {
                username: data.username,
                password: data.password,
            })
                .then((resp) => {
                    ElMessage({
                        showClose: true,
                        type: 'success',
                        message: '登陆成功~',
                        duration: 3000,
                    })
                    const {access, refresh} = resp.data;
                    const access_obj: any = jwt_decode(access);

                    context.commit('set_access', access)
                    context.commit('set_refresh', refresh)

                    authGet(system_base_url + 'account/accounts/' + access_obj.user_id, {})
                        .then((resp) => {
                            context.commit("set_account", resp.data);
                            data.success();
                        });
                }).catch((error) => {
                console.log(error);
                data.error();
            });
        },

        logout(context) {
            context.commit("clear_account")
        }
    },
    modules: {}
};

export default ModuleAccount;
