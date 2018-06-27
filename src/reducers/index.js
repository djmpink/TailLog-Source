import {combineReducers} from "redux";
import actions from "../actions";
import AjaxAction from "../actions/AjaxAction";

//所有显示层的东西
let ui = (state = {}, action) => {
    switch (action.type) {
        case actions.SHOW_CONFIG_RIGHT:
            return {
                ...state,
                showConfigRight: action.flag,
            };
        default:
            return state;
    }
};
let user = (state = {}, action) => {
    let obj;
    switch (action.type) {
        // case AjaxAction.CURRENT_USER:
        //     return {...state, ...action.data};
        case AjaxAction.LOGIN:
            obj = Object.assign({}, action.data);
            localStorage["token"] = action.data.token;
            return obj;
        case AjaxAction.OAUTH2_CALLBACK:
            obj = Object.assign({}, action.data);
            localStorage['token'] = action.data.token;
            return obj;
        case AjaxAction.LOGOUT:
            delete localStorage['token'];
            return {};
        case AjaxAction.AJAX_FAIL:
            let response = action.data;
            let code = response.code;
            if (code === "USER_TOKEN_MISS") {
                //特殊处理,这种情况下准备直接跳转页面了，所以不处理了
                delete localStorage['token'];
                return {loggedIn: false};
            }
        //其他情况的AJAX_FAIL下直接返回state
        //eslint-disable-next-line
        default:
            return state;
    }
};
//配置列表
let configList = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_LIST: {
            // data.list.forEach((i,index)=>{
            //     i.ip=i.ip+" （"+i.ipName+"）";
            // });
            return data.list;
        }
        case AjaxAction.CONFIG_REMOVE:
            return state.filter((v) => {
                return v.logId !== action.logId;
            });
        default:
            return state;
    }
};
let config = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_DETAIL: {
            return data;
        }
        default:
            return state;
    }
};
let dropdown = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_DROPDOWN: {
            return data;
        }
        default:
            return state;
    }
};

//配置列表
let sshList = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_SSH_LIST: {
            return data.list;
        }
        case AjaxAction.CONFIG_SSH_REMOVE:
            return state.filter((v) => {
                return v.id !== action.id;
            });
        default:
            return state;
    }
};
let ssh = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_SSH_DETAIL: {
            return data;
        }
        case actions.REMOVE_CURRENT_SSH:
            return {};
        default:
            return state;
    }
};

let configTest = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_SSH_TEST: {
            return data;
        }
        default:
            return state;
    }
};

let groupList = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_GROUP_LIST: {
            return data.list;
        }
        case AjaxAction.CONFIG_GROUP_REMOVE:
            return state.filter((v) => {
                return v.id !== action.id;
            });
        default:
            return state;
    }
};
let group = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_GROUP_DETAIL: {
            return data;
        }
        case actions.REMOVE_CURRENT_GROUP:
            return {};
        default:
            return state;
    }
};

let agentDropdown = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_SSH_DROPDOWN: {
            return data;
        }
        default:
            return state;
    }
};

//配置列表
let agentList = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_AGENT_LIST: {
            return data.list;
        }
        case AjaxAction.CONFIG_AGENT_REMOVE:
            return state.filter((v) => {
                return v.id !== action.id;
            });
        default:
            return state;
    }
};
let agent = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_AGENT_DETAIL: {
            return data;
        }
        case actions.REMOVE_CURRENT_AGENT:
            return {};
        default:
            return state;
    }
};
let sshDropdown = (state = [], action) => {
    let {data} = action;
    switch (action.type) {
        case AjaxAction.CONFIG_SSH_DROPDOWN: {
            return data;
        }
        default:
            return state;
    }
};
let currentDropdown = (state = {}, action) => {
    switch (action.type) {
        case actions.FILL_DROPDOWN: {
            return action.record;
        }
        default:
            return state;
    }
};
let currentConfig = (state = {}, action) => {
    switch (action.type) {
        case actions.FILL_CURRENT_CONFIG:
            return action.record;
        case actions.REMOVE_CURRENT_CONFIG:
            return {};
        default:
            return state;
    }
};
let currentSSH = (state = {}, action) => {
    switch (action.type) {
        case actions.FILL_CURRENT_SSH:
            return action.record;
        case actions.REMOVE_CURRENT_SSH:
            return {};
        default:
            return state;
    }
};
let currentAgent = (state = {}, action) => {
    switch (action.type) {
        case actions.FILL_CURRENT_AGENT:
            return action.record;
        case actions.REMOVE_CURRENT_AGENT:
            return {};
        default:
            return state;
    }
};
let currentGroup = (state = {}, action) => {
    switch (action.type) {
        case actions.FILL_CURRENT_GROUP:
            return action.record;
        case actions.REMOVE_CURRENT_GROUP:
            return {};
        default:
            return state;
    }
};
let userSetting = (state = {}, action) => {
    switch (action.type) {
        case AjaxAction.USER_SETTING_INFO:
            return action.data;
        case AjaxAction.USER_SETTING_INFO_EDIT:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
};

let globalError = (state = {}, action) => {
    switch (action.type) {
        case AjaxAction.AJAX_FAIL: {
            let response = action.data;
            //除了一些特殊情况，其他的就只需要显示msg信息
            let status = response.status;
            let code = response.code;
            let message = response.msg || "服务器开小差了";
            if (code === "USER_TOKEN_MISS") {
                //特殊处理,这种情况下准备直接跳转页面了，所以不处理了
                setTimeout(() => {
                    window.location.href = "/#/login";
                }, 1000);
                return {
                    msg: "登录信息失效，请重新登录",
                    show: true,
                };
            }
            //eslint-disable-next-line
            if (status && status != "200") {
                let {responseJSON} = response;
                //暂时采用这种信息方便查看
                message = `HTTP ${status}:${responseJSON.message}`;
            }
            return {
                msg: message,
                show: true,
            }
        }
        default:
            return state;
    }
};

export default combineReducers({
    user,
    ui,
    config,
    configList,
    dropdown,
    ssh,
    sshList,
    sshDropdown,
    agent,
    agentList,
    agentDropdown,
    currentDropdown,
    currentConfig,
    currentSSH,
    currentAgent,
    userSetting,
    globalError,
    configTest,
    groupList,
    group,
    currentGroup
})