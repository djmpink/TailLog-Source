const AJAX_START = "AJAX_START";//通用ajax开始
const AJAX_FAIL = "AJAX_FAIL";//通用ajax失败
const AJAX_LOADING_START = "AJAX_LOADING_START";//通用的带加载的ajax开始
let ajaxStart = (data) => {
    //考虑获取ajax前的处理
    return {
        type: AJAX_START,
        data
    }
};
let ajaxFail = (data) => {
    return {
        type: AJAX_FAIL,
        data
    }
};
let ajaxLoadingStart = (data) => {
    return {
        type: AJAX_LOADING_START,
        data
    }
};
export default {
    AJAX_START,
    AJAX_FAIL,
    AJAX_LOADING_START,
    ajaxStart,
    ajaxFail,
    ajaxLoadingStart,
}