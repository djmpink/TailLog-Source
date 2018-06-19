/*eslint-disable*/
var URL = function (url) {
    this.parse(url);
};

URL.prototype = {
    /**
     * 解析URL，注意解析锚点必须在解析GET参数之前，以免锚点影响GET参数的解析
     * @param{String} url? 如果传入参数，则将会覆盖初始化时的传入的url 串
     */
    parse: function (url) {
        if (url) {
            this.url = url;
        }
        this.parseAnchor();
        this.parseParam();

        return this;
    },
    /**
     * 解析锚点 #anchor
     */
    parseAnchor: function () {
        var anchor = this.url.match(/\#(.*)/);
        anchor = anchor ? anchor[1] : null;
        this._anchor = anchor;
        if (anchor != null) {
            this.anchor = this.getNameValuePair(anchor);
            this.url = this.url.replace(/\#.*/, "");
        }

        return this;
    },

    /**
     * 解析GET参数 ?name=value;
     */
    parseParam: function () {
        var query = this.url.match(/\?([^\?]*)/);
        query = query ? query[1] : null;
        if (query != null) {
            this.url = this.url.replace(/\?([^\?]*)/, "");
            this.query = this.getNameValuePair(query);
        }

        return this;
    },
    /**
     * 目前对json格式的value 不支持
     * @param {String} str 为值对形式,其中value支持 '1,2,3'逗号分割
     * @return 返回str的分析结果对象
     */
    getNameValuePair: function (str) {
        var o = {};
        str.replace(/([^&=]*)(?:\=([^&]*))?/gim, function (w, n, v) {
            if (n == "") {
                return;
            }
            //v = v || "";//alert(v)
            //o[n] = ((/[a-z\d]+(,[a-z\d]+)*/.test(v)) || (/^[\u00ff-\ufffe,]+$/.test(v)) || v=="") ? v : (v.j2o() ? v.j2o() : v);
            o[n] = v || "";
        });
        return o;
    },
    /**
     * 从 URL 中获取指定参数的值
     * @param {Object} sPara
     */
    getParam: function (sPara) {
        return this.query[sPara] || "";
    },
    /**
     * 清除URL实例的GET请求参数
     */
    clearParam: function () {
        this.query = {};

        return this;
    },

    /**
     * 设置GET请求的参数，当个设置
     * @param {String} name 参数名
     * @param {String} value 参数值
     */
    setParam: function (name, value) {
        if (name == null || name == "" || typeof(name) != "string") {
            throw new Error("no param name set");
        }
        this.query = this.query || {};
        this.query[name] = value;

        return this;
    },

    /**
     * 设置多个参数，注意这个设置是覆盖式的，将清空设置之前的所有参数。设置之后，URL.query将指向o，而不是duplicate了o对象
     * @param {Object} o 参数对象，其属性都将成为URL实例的GET参数
     */
    setParams: function (o) {
        this.query = o;
        return this;
    },

    /**
     * 序列化一个对象为值对的形式
     * @param {Object} o 待序列化的对象，注意，只支持一级深度，多维的对象请绕过，重新实现
     * shouldEncode: 是否需要encode，只要不为false都需要
     * @return {String} 序列化之后的标准的值对形式的String
     */
    serialize: function (o, shouldEncode) {
        var ar = [];
        for (var i in o) {
            //考虑传入的值为0的情况
            if (o[i] != 0 && (o[i] == null || o[i] == "")) {
                ar.push(i + "=");
            }
            else {
                if (shouldEncode === false) {
                    ar.push(i + '=' + o[i]);
                } else {
                    ar.push(i + "=" + encodeURIComponent(o[i]));
                }

            }
        }
        return ar.join("&");
    },
    /**
     * 将URL对象转化成为标准的URL地址
     * @return {String} URL地址
     */
    toString: function () {
        var queryStr = this.serialize(this.query);
        return this.url + (queryStr.length > 0 ? "?" + queryStr : "")
            + (this.anchor ? "#" + this.serialize(this.anchor) : "");
    },

    /**
     * 得到anchor的串
     * @param {Boolean} forceSharp 强制带#符号
     * @return {String} 锚anchor的串
     */
    getHashStr: function (forceSharp) {
        return (forceSharp ? "#" : "") + (this.anchor ? this.serialize(this.anchor) : "");
    }
};

function factory(url) {
    return new URL(url);
}

factory.serialize = URL.prototype.serialize;

export default factory;