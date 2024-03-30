import {ElLoading} from "element-plus";

const LoadingInstance = {
    _target: null,
    _count: 0
};

export const closeLoading = () => {
    if (LoadingInstance._count > 0) LoadingInstance._count--;
    if (LoadingInstance._count === 0) {
        LoadingInstance._target.close();
        LoadingInstance._target = null;
    }
}

export const Loading = (sentence) => {
    LoadingInstance._count++;
    if (LoadingInstance._count === 1) {
        LoadingInstance._target = ElLoading.service({text: sentence});
    }
}