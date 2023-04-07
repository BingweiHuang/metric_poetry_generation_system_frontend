import {Get, system_base_url} from "@/utils/request";

const ModuleRhyme = {
    state: {
        xinyun2word: {
            '仄声': {},
            '平声': {},
        },
        pingshui2word: {
            '上声': {
                '上声': [],
            },
            '去声': {
                '上声': [],
            },
            '入声': {
                '上声': [],
            },
            '平声': {
                '上声': [],
            },
        },
    },
    getters: {
        get_xinyun:(state) => (obj) => {
            let res = []
            if (Object.keys(state.xinyun2word[obj.sheng_tag]).includes(obj.yun_tag)) {
                res = state.xinyun2word[obj.sheng_tag][obj.yun_tag]
            }
            return res
        },
        get_pingshui:(state) => (obj) => {
            let res = []
            if (Object.keys(state.pingshui2word[obj.sheng_tag]).includes(obj.yun_tag)) {
                res = state.pingshui2word[obj.sheng_tag][obj.yun_tag]
            }
            return res
        },
    },
        mutations: {
        set_xinyun(state, obj) {

            state.xinyun2word[obj.sheng_tag][obj.yun_tag] = obj.data;
        },
        set_pingshui(state, obj) {

            state.pingshui2word[obj.sheng_tag][obj.yun_tag] = obj.data;
        },
    },
    actions: {
        async updateAllRhyme(context, obj) {
            await Get(system_base_url + 'rhyme/all_rhyme/', {})
            .then((resp) => {
                context.commit('set_xinyun', resp.data.xinyun2word);
                context.commit('set_pingshui', resp.data.pingshui2word);
                obj.success();
            })
            .catch((error) => {
                console.log(error);
                obj.error();
            })
        },

        async updateRhyme(context, obj) {
            await Get(system_base_url + 'rhyme/get_rhyme/', {
                kind: obj.kind, sheng_tag: obj.sheng_tag, yun_tag: obj.yun_tag
            })
                .then((resp) => {
                    if (obj.kind === 1) {
                        context.commit('set_pingshui', {
                            sheng_tag: obj.sheng_tag, yun_tag: obj.yun_tag, data:resp.data.list
                        });
                    } else if (obj.kind === 2) {
                        context.commit('set_xinyun', {
                            sheng_tag: obj.sheng_tag, yun_tag: obj.yun_tag, data:resp.data.list
                        });
                    }
                    obj.success();
                })
                .catch((error) => {
                    console.log(error);
                    obj.error();
                })
        }
    },
    modules: {

    }
}

export default ModuleRhyme;