/*eslint-disable*/
import CommonAction from "../actions/CommonAction";
import { message} from "antd";

let headers = {
    text: {
        'Accept': '*/*',
        'Content-Type': 'text/html'
    },
    json: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
    },
    form: {
        'Accept': '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
};
const ONLINE = "http://121.40.214.161:9000";
const LOCAL = "http://127.0.0.1:10777";

//获取当前的token值（主要用于登录）
let getToken = () => {
    return localStorage['token'];
};

let ajax = (opts) => {
    opts = Object.assign({}, {
        method: 'get',
        type: 'json',
        headers: headers['json'],
        //credentials: 'omit'//不能设置成Include，会出错，要求服务器必须得设置CORS且不能是*
    }, opts);
    !opts.method && (opts.method = 'get');
    opts.method = opts.method.toLowerCase();
    opts.body = opts.data || opts.body;
    let url = opts.url;
    delete opts.data;
    if (!url.startsWith("http")) {
        url = ONLINE + url;
    }
    if (typeof opts.body != 'undefined') {
        if (opts.method === 'get') {
            var target = url(url).setParams(opts.body || {});
            opts.url = target.toString();
            opts.body = undefined;
            delete opts.body;
        }
        if (opts.method === 'post') {
            //body请自行进行JSON.stringify处理
            opts.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
        }
    }
    //opts.headers = opts.method == 'post' ? headers['form'] : headers[opts.type];
    opts.headers = Object.assign({}, opts.headers, headers[opts.type]);

    return fetch(opts.url, opts).then(function (response) {
        if (!response.ok) {
            var error = new Error();
            error.name = response.status;
            error.data = response;
            // console.log(response.status);
            if(response.status === 404){
                message.warn("本地离线版需下载安装最新客户端 www.tail.cn ", 10);
            }
            throw error;
        }

        return response.text().then(function (text) {
            //console.log('netinfo',opts, text);
            if (opts.type === 'json') {
                return JSON.parse(text);
            }
            else {
                return text;
            }
        });
    }).catch(e => console.warn(e));
};


let ajaxCommon = ({api, data, success, fail}) => {
    let {ajaxStart, ajaxFail} = CommonAction;
    return (dispatch) => {

        let token = getToken();
        let url = api.url;
        if (!url.startsWith("http")) {
            if (token) {
                url = ONLINE + api.url;
            } else {
                url = LOCAL + api.url;
            }
        }

        dispatch(ajaxStart({api, data, success, fail}));
        let ajaxOptions = {
            url: url,
            method: api.method
        };
        //数组不需要转换，否则会被转化成对象
        if (data instanceof Array) {
            ajaxOptions.data = data;
        } else {
            data && (ajaxOptions.data = {...data});
        }

        token && (ajaxOptions.headers = {"auth-token": token});
        let ajaxResult = ajax(ajaxOptions)
            .then((json) => {
                if (json && json.result && success) {
                    dispatch(success(json.data || {...data}))
                } else {
                    //异常情况处理，此处先直接打印错误信息,如果用户传入的fail方法，调用之，否则触发全局错误方法
                    console.error(json);
                    if (fail) {
                        dispatch(fail(json));
                    } else {
                        dispatch(ajaxFail(json));
                    }

                }
                //统一返回 后端返回的数据
                return json;

            })
            .catch((e) => {
                dispatch(ajaxFail(e));
                return e;
            });

        return ajaxResult;


    }
};
export default {
    ajax,
    ajaxCommon,
    getToken,
};