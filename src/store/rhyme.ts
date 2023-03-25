import {instance} from "@/utils/utils";
import {Get} from "@/utils/request";

const ModuleRhyme = {
    state: {
        xinyun2word: {},
        pingshui2word: {},
    },
    getters: {
        get_xinyun(state:any) {
            return state.xinyun2word
        },
        get_pingshui(state:any) {
            return state.pingshui2word
        },
    },
    mutations: {
        set_xinyun(state:any, data:any) {

            state.xinyun2word = data;
            // console.log('commit成功', state.xinyun2word)
        },
        set_pingshui(state:any, data:any) {

            state.pingshui2word = data;
            // console.log('commit成功', state.pingshui2word)
        },
    },
    actions: {
        async updateAllRhyme(context: any, data: any) {
            await Get('rhyme/all_rhyme/', {}, false)
            .then((resp) => {
                console.log('resp.data.xinyun2word:', resp.data.xinyun2word)
                console.log('resp.data.pingshui2word:', resp.data.pingshui2word)
                context.commit('set_xinyun', resp.data.xinyun2word);
                context.commit('set_pingshui', resp.data.pingshui2word);
                data.success();
            })
            .catch((error) => {
                console.log(error);
                data.error();
            })
        }
    },
    modules: {

    }
}

export default ModuleRhyme;