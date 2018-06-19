const ENV = process.env.NODE_ENV === 'development';//npm start会将当前环境设置为development
//所以开发环境下用我们线上服务器的；产品环境下用内网的
const PREFIX = ENV ? "http://121.40.214.161:9000" : "http://121.40.214.161:9000";
const LOCAL = "http://127.0.0.1:10777";
let Login = {
    login: {
        url: PREFIX + "/v1/user/login",
        method: "post"
    },
    logout: {
        url: PREFIX + "/v1/user/logout",
        method: "post"
    },
    currentUser: {
        url: PREFIX + "/v1/user/currentUser",
        method: "get",
    },
    reg: {
        url: PREFIX + "/v1/user/register",
        method: "post"
    },
    activate: {
        url: PREFIX + "/v1/user/email/activate",
        method: "post"
    },
    oauth2Callback: (platform, code) => ({
        url: PREFIX + `/v1/user/oauth2/callback/${platform}/${code}`,
        method: "get"
    }),
    oauth2Login: (platform) => ({
        url: PREFIX + `/v1/user/oauth2/login/${platform}`,
        method: "get"
    }),

    reset: {
        url: PREFIX + "/v1/user/reset",
        method: "post"
    },
    find: {
        url: PREFIX + "/v1/user/find",
        method: "post"
    },
    forget: {
        url: PREFIX + "/v1/user/forget",
        method: "post"
    },
    binding: {
        url: PREFIX + "/v1/user/binding",
        method: "post"
    },
    bindingActivate: {
        url: PREFIX + "/v1/user/binding/activate",
        method: "post"
    }
};

let LogConfig = {
    add: {
        url: "/v1/log/config/add",
        method: "post"
    },
    list: {
        url: "/v1/log/config/list",
        method: "post"
    },
    edit: (logId) => ({
        url: `/v1/log/config/${logId}/edit`,
        method: "post"
    }),
    detail: (logId) => ({
        url: `/v1/log/config/${logId}`,
        method: "get"
    }),
    remove: (logId) => ({
        url: `/v1/log/config/${logId}/remove`,
        method: "post"
    }),
    dropdown: {
        url: `/v1/log/config/dropdown`,
        method: "post",
    }
};

let LogConfigSSH = {
    add: {
        url: "/v1/log/config/ssh/add",
        method: "post"
    },
    list: {
        url: "/v1/log/config/ssh/list",
        method: "post"
    },
    edit: (id) => ({
        url: `/v1/log/config/ssh/${id}/edit`,
        method: "post"
    }),
    detail: (id) => ({
        url: `/v1/log/config/ssh/${id}`,
        method: "get"
    }),
    remove: (id) => ({
        url: `/v1/log/config/ssh/${id}/remove`,
        method: "post"
    }),
    dropdown: {
        url: `/v1/log/config/ssh/dropdown`,
        method: "post",
    },
    testSSH: {
        url: LOCAL + "/testSSH",
        method: "post"
    },
};
let LogConfigGroup = {
    add: {
        url: "/v1/log/config/group/add",
        method: "post"
    },
    list: {
        url: "/v1/log/config/group/list",
        method: "post"
    },
    edit: (id) => ({
        url: `/v1/log/config/group/${id}/edit`,
        method: "post"
    }),
    detail: (id) => ({
        url: `/v1/log/config/group/${id}`,
        method: "get"
    }),
    remove: (id) => ({
        url: `/v1/log/config/group/${id}/remove`,
        method: "post"
    }),
    dropdown: {
        url: `/v1/log/config/group/dropdown`,
        method: "post",
    }
};

let LogConfigAgent = {
    add: {
        url: "/v1/log/config/agent/add",
        method: "post"
    },
    list: {
        url: "/v1/log/config/agent/list",
        method: "post"
    },
    edit: (id) => ({
        url: `/v1/log/config/agent/${id}/edit`,
        method: "post"
    }),
    detail: (id) => ({
        url: `/v1/log/config/agent/${id}`,
        method: "get"
    }),
    remove: (id) => ({
        url: `/v1/log/config/agent/${id}/remove`,
        method: "post"
    }),
    dropdown: {
        url: `/v1/log/config/agent/dropdown`,
        method: "post",
    }
};
let UserSetting = {
    account: {
        url: PREFIX + "/v1/user/setting/account",
        method: "get"
    },
    info: {
        url: PREFIX + "/v1/user/setting/info",
        method: "get"
    },
    infoEdit: {
        url: PREFIX + "/v1/user/setting/info/edit",
        method: "post"
    },
    feedback: {
        url: PREFIX + "/v1/user/setting/feedback",
        method: "post"
    }
};

export default {
    Login,
    LogConfig,
    LogConfigSSH,
    LogConfigAgent,
    UserSetting,
    LogConfigGroup
}