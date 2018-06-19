import Ajax from "../utils/ajax.js";
import API from "../utils/ApiList";

const {
    ajaxCommon
} = Ajax;

const TheLogConfigApi = API.LogConfig;
const TheLogConfigSSHApi = API.LogConfigSSH;
const TheLogConfigAgentApi = API.LogConfigAgent;
const TheLogConfigGroupApi = API.LogConfigGroup;

//日志配置管理
const CONFIG_LIST = "CONFIG_LIST";//获取日志配置列表
const CONFIG_DETAIL = "CONFIG_DETAIL";//获取日志配置详情
const CONFIG_ADD = "CONFIG_ADD";//新增日志配置
const CONFIG_EDIT = "CONFIG_EDIT";//编辑日志配置
const CONFIG_REMOVE = "CONFIG_REMOVE";//删除日志配置
const CONFIG_DROPDOWN = "CONFIG_DROPDOWN";//获取日志配置下拉列表

//SSH连接配置相关
const CONFIG_SSH_LIST = "CONFIG_SSH_LIST";
const CONFIG_SSH_DETAIL = "CONFIG_SSH_DETAIL";
const CONFIG_SSH_ADD = "CONFIG_SSH_ADD";
const CONFIG_SSH_EDIT = "CONFIG_SSH_EDIT";
const CONFIG_SSH_REMOVE = "CONFIG_SSH_REMOVE";
const CONFIG_SSH_DROPDOWN = "CONFIG_SSH_DROPDOWN";
const CONFIG_SSH_TEST = "CONFIG_SSH_TEST";

//代理配置相关
const CONFIG_AGENT_LIST = "CONFIG_AGENT_LIST";
const CONFIG_AGENT_DETAIL = "CONFIG_AGENT_DETAIL";
const CONFIG_AGENT_ADD = "CONFIG_AGENT_ADD";
const CONFIG_AGENT_EDIT = "CONFIG_AGENT_EDIT";
const CONFIG_AGENT_REMOVE = "CONFIG_AGENT_REMOVE";
const CONFIG_AGENT_DROPDOWN = "CONFIG_AGENT_DROPDOWN";

//分组管理相关
const CONFIG_GROUP_LIST = "CONFIG_GROUP_LIST";
const CONFIG_GROUP_DETAIL = "CONFIG_GROUP_DETAIL";
const CONFIG_GROUP_ADD = "CONFIG_GROUP_ADD";
const CONFIG_GROUP_EDIT = "CONFIG_GROUP_EDIT";
const CONFIG_GROUP_REMOVE = "CONFIG_GROUP_REMOVE";
const CONFIG_GROUP_DROPDOWN = "CONFIG_GROUP_DROPDOWN";


export default {
    CONFIG_ADD,
    configAdd: (one) => {
        return ajaxCommon({
            api: TheLogConfigApi.add,
            data: one,
            success: (data) => ({
                type: CONFIG_ADD,
                data
            })
        })
    },
    CONFIG_LIST,
    configList: (search) => {
        search.page = search.current;
        return ajaxCommon({
            api: TheLogConfigApi.list,
            data: search,
            success: (data) => ({
                type: CONFIG_LIST,
                data
            })
        })
    },
    CONFIG_EDIT,
    configEdit: (logId, info) => {
        return ajaxCommon({
            api: TheLogConfigApi.edit(logId),
            data: info,
            success: (data) => ({
                type: CONFIG_EDIT,
                data
            })
        })
    },
    CONFIG_DETAIL,
    configDetail: (logId) => {
        return ajaxCommon({
            api: TheLogConfigApi.detail(logId),
            success: (data) => ({
                type: CONFIG_DETAIL,
                data
            })
        })
    },
    CONFIG_REMOVE,
    configRemove: (logId) => {
        return ajaxCommon({
            api: TheLogConfigApi.remove(logId),
            success: (data) => ({
                type: CONFIG_REMOVE,
                logId,
                data
            })
        })
    },
    CONFIG_DROPDOWN,
    configDropDown: () => {
        return ajaxCommon({
            api: TheLogConfigApi.dropdown,
            success: (data) => ({
                type: CONFIG_DROPDOWN,
                data,
            })
        })
    },
    CONFIG_SSH_ADD,
    configSSHAdd: (one) => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.add,
            data: one,
            success: (data) => ({
                type: CONFIG_SSH_ADD,
                data
            })
        })
    },
    CONFIG_SSH_LIST,
    configSSHList: (search) => {
        search.page = search.current;
        return ajaxCommon({
            api: TheLogConfigSSHApi.list,
            data: search,
            success: (data) => ({
                type: CONFIG_SSH_LIST,
                data
            })
        })
    },
    CONFIG_SSH_EDIT,
    configSSHEdit: (logId, info) => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.edit(logId),
            data: info,
            success: (data) => ({
                type: CONFIG_SSH_EDIT,
                data
            })
        })
    },
    CONFIG_SSH_DETAIL,
    configSSHDetail: (logId) => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.detail(logId),
            success: (data) => ({
                type: CONFIG_SSH_DETAIL,
                data
            })
        })
    },
    CONFIG_SSH_REMOVE,
    configSSHRemove: (logId) => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.remove(logId),
            success: (data) => ({
                type: CONFIG_SSH_REMOVE,
                logId,
                data
            })
        })
    },
    CONFIG_SSH_DROPDOWN,
    configSSHDropDown: () => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.dropdown,
            success: (data) => ({
                type: CONFIG_SSH_DROPDOWN,
                data,
            })
        })
    },
    CONFIG_SSH_TEST,
    sshConnect: (values) => {
        return ajaxCommon({
            api: TheLogConfigSSHApi.testSSH,
            data: values,
            success: (data) => ({
                type: CONFIG_SSH_TEST,
                data
            })
        })
    },
    CONFIG_AGENT_ADD,
    configAgentAdd: (one) => {
        return ajaxCommon({
            api: TheLogConfigAgentApi.add,
            data: one,
            success: (data) => ({
                type: CONFIG_AGENT_ADD,
                data
            })
        })
    },
    CONFIG_AGENT_LIST,
    configAgentList: (search) => {
        search.page = search.current;
        return ajaxCommon({
            api: TheLogConfigAgentApi.list,
            data: search,
            success: (data) => ({
                type: CONFIG_AGENT_LIST,
                data
            })
        })
    },
    CONFIG_AGENT_EDIT,
    configAgentEdit: (id, info) => {
        return ajaxCommon({
            api: TheLogConfigAgentApi.edit(id),
            data: info,
            success: (data) => ({
                type: CONFIG_AGENT_EDIT,
                data
            })
        })
    },
    CONFIG_AGENT_DETAIL,
    configAgentDetail: (id) => {
        return ajaxCommon({
            api: TheLogConfigAgentApi.detail(id),
            success: (data) => ({
                type: CONFIG_AGENT_DETAIL,
                data
            })
        })
    },
    CONFIG_AGENT_REMOVE,
    configAgentRemove: (id) => {
        return ajaxCommon({
            api: TheLogConfigAgentApi.remove(id),
            success: (data) => ({
                type: CONFIG_AGENT_REMOVE,
                id,
                data
            })
        })
    },
    CONFIG_AGENT_DROPDOWN,
    configAgentDropDown: () => {
        return ajaxCommon({
            api: TheLogConfigAgentApi.dropdown,
            success: (data) => ({
                type: CONFIG_AGENT_DROPDOWN,
                data,
            })
        })
    },

    CONFIG_GROUP_LIST,
    configGroupList: (search) => {
        search.page = search.current;
        return ajaxCommon({
            api: TheLogConfigGroupApi.list,
            data: search,
            success: (data) => ({
                type: CONFIG_GROUP_LIST,
                data
            })
        })
    },

    CONFIG_GROUP_ADD,
    configGroupAdd: (one) => {
        return ajaxCommon({
            api: TheLogConfigGroupApi.add,
            data: one,
            success: (data) => ({
                type: CONFIG_GROUP_ADD,
                data
            })
        })
    },
    CONFIG_GROUP_EDIT,
    configGroupEdit: (logId, info) => {
        return ajaxCommon({
            api: TheLogConfigGroupApi.edit(logId),
            data: info,
            success: (data) => ({
                type: CONFIG_GROUP_EDIT,
                data
            })
        })
    },
    CONFIG_GROUP_DETAIL,
    configGroupDetail: (logId) => {
        return ajaxCommon({
            api: TheLogConfigGroupApi.detail(logId),
            success: (data) => ({
                type: CONFIG_GROUP_DETAIL,
                data
            })
        })
    },
    CONFIG_GROUP_REMOVE,
    configGroupRemove: (logId) => {
        return ajaxCommon({
            api: TheLogConfigGroupApi.remove(logId),
            success: (data) => ({
                type: CONFIG_GROUP_REMOVE,
                logId,
                data
            })
        })
    },
    CONFIG_GROUP_DROPDOWN,
    configGroupDropDown: () => {
        return ajaxCommon({
            api: TheLogConfigGroupApi.dropdown,
            success: (data) => ({
                type: CONFIG_GROUP_DROPDOWN,
                data,
            })
        })
    },
}