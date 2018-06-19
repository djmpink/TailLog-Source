/**
 * Created by CoolGuy on 2017/3/18.
 * 用于加解密，目前先简单地实现一个移位算法
 */

export let en = (str) => {
    let len = str.length;
    let arr = [];
    for (let i = 0; i < len; i++) {
        arr[i] = str.charCodeAt(i);//charCodeAt 总是返回一个小于 65,536 的值
        arr[i] += 10;
    }
    return arr.join(",");
};

export let de = (str) => {
    let arr = str.split(",");
    if (!arr || !arr.length) {
        return str;//兼容旧的没有加密的密码
    }
    arr = arr.map((v) => {
        return (Number(v) - 10);
    });
    return String.fromCharCode(...arr);

};
