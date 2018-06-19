import API from "../utils/ApiList";
import Ajax from "../utils/ajax.js";
import CommonAction from "./CommonAction";
import {en} from "../utils/crypto";
const {
    ajax,
    ajaxCommon
} = Ajax;

const {
    ajaxStart,
    ajaxFail,
} = CommonAction;

//actions
const LOGIN = "LOGIN";//登录
const OAUTH2_LOGIN = "OAUTH2_LOGIN";//三方登录
const OAUTH2_CALLBACK = "OAUTH2_CALLBACK";//三方登录
const REG = "REG";//注册
const LOGIN_FORGET = "LOGIN_FORGET";//忘记密码
const RESET = "RESET";//重置密码
const FIND = "FIND";//重置密码
const LOGOUT = "LOGOUT";//退出登录
const ACTIVATE = "ACTIVATE";//激活
const BINDING = "BINDING";//绑定邮箱
const BINDING_ACTIVATE = "BINDING_ACTIVATE";//绑定邮箱 验证


let resetSuccess = (data) => {
    return {
        type: RESET,
        data
    }
};

let forgetSuccess = (data) => {
    return {
        type: LOGIN_FORGET,
        data
    }
};

let logoutSuccess = (data) => {
    return {
        type: LOGOUT,
        data
    }
};

export default {
    LOGIN,
    login: (email, password) => {
        return (dispatch) => {
            dispatch(ajaxStart());
            let req = API.Login.login;
            return ajax({
                url: req.url,
                method: req.method,
                body: {email, password}
            }).then((data) => {
                if (data && data.result) {
                    //将用户信息保存下来
                    localStorage['email'] = email;
                    localStorage['password'] = en(password);
                    dispatch({
                        type: LOGIN,
                        data: data.data
                    })
                } else {
                    //异常情况处理，此处先直接打印错误信息
                    dispatch(ajaxFail(data));
                }
                //都统一返回data，方便后续处理
                return data;
            }).catch(e => dispatch(ajaxFail(e)));
        }
    },
    REG,
    reg: (email, nickname, password, url) => {
        return (dispatch) => {
            dispatch(ajaxStart());
            let req = API.Login.reg;
            return ajax({
                url: req.url,
                method: req.method,
                body: {email, nickname, password, url}
            }).then((data) => {
                if (data && data.result) {
                    dispatch({
                        type: REG,
                        data: data.data
                    })
                } else {
                    dispatch(ajaxFail(data));
                }
                //都统一返回data，方便后续处理
                return data;
            }).catch(e => dispatch(ajaxFail(e)));
        }
    },
    OAUTH2_LOGIN,
    oauth2Login: (platform) => {
        return ajaxCommon({
            api: API.Login.oauth2Login(platform),
            success: (data) => ({
                type: OAUTH2_LOGIN,
                data
            })
        });
    },
    OAUTH2_CALLBACK,
    oauth2Callback: (platform, code) => {
        return ajaxCommon({
            api: API.Login.oauth2Callback(platform, code),
            success: (data) => ({
                type: OAUTH2_CALLBACK,
                data
            })
        });
    },
    ACTIVATE,
    activate: (email, ticket) => {
        return ajaxCommon({
            api: API.Login.activate,
            data: {email, ticket},
            success: (data) => ({
                type: ACTIVATE,
                data
            })
        });
    },
    BINDING,
    binding: (email, url) => {
        return ajaxCommon({
            api: API.Login.binding,
            data: {email, url},
            success: (data) => ({
                type: BINDING,
                data
            })
        });
    },
    BINDING_ACTIVATE,
    bindingActivate: (email, ticket) => {
        return ajaxCommon({
            api: API.Login.bindingActivate,
            data: {email, ticket},
            success: (data) => ({
                type: BINDING_ACTIVATE,
                data
            })
        });
    },
    RESET,
    reset: (email, origin, fresh, ticket) => {
        return ajaxCommon({
            api: API.Login.reset,
            data: {email, origin, fresh, ticket},
            success: resetSuccess
        });
    },
    FIND,
    find: (email, origin, fresh, ticket) => {
        return ajaxCommon({
            api: API.Login.find,
            data: {email, origin, fresh, ticket},
            success: resetSuccess
        });
    },
    LOGIN_FORGET,
    loginForget: (email, url) => {
        return ajaxCommon({
            api: API.Login.forget,
            data: {email, url},
            success: forgetSuccess
        });
    },
    LOGOUT,
    logout: () => {
        return ajaxCommon({
            api: API.Login.logout,
            success: logoutSuccess
        });
    }
}