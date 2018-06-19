import moment from "moment";
//统一返回YYYY-MM-DD HH:ii:ss
let paddingLeft0 = (time) => {
    return (time < 10 ? '0' + time : time);
};
let formatDate = (date) => {
    // let dateLen =date.getTime().toString().length;
    // //JS的date对象是使用的13位（10进制）的时间戳
    // if(dateLen !== 13){
    //     console.log(dateLen);
    //     date = 1000 * date;
    // }
    let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate(),
        h = date.getHours(),
        i = date.getMinutes(),
        s = date.getSeconds();
    return y + "-" + paddingLeft0(m) + "-" + paddingLeft0(d) + ' ' + paddingLeft0(h) + ":" + paddingLeft0(i) + ":" + paddingLeft0(s);

};
//将长整型数转化为日期字符串
export let convertLongToString = (longTime) => {
    //console.log(longTime);
    let date = new Date(longTime);
    return formatDate(date);
};

//从list中找keyName值为key的obj
export let findObjByKey = (list, key, keyName = "key") => {
    if (!list) {
        return null;
    }
    return list.find((v) => {
        return v[keyName] === key;
    })
};
export let convertLongToMoment = (longTime) => {
    return moment(longTime, "YYYY-MM-DD");
};