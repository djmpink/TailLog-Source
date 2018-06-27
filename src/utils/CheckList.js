export  default {
    username: (str) => {
        return /^[\w\d]+$/.test(str);
    },
    password: (str) => {
        //6~20位
        return /^.{6,20}$/.test(str);
    },
    //手机号码校验
    mobile(text){
        return /^(1\d{10})$/.test(text);
    },
    // 身份证校验
    identity(text){
        let weightFactor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; //加权因子
        let verifyCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']; //校验码
        let sum = 0;
        let mod = 0;

        if (!(/^\s*[0-9]{17}[0-9X]\s*$/).test(text)) {
            return false;
        }

        for (let i = 0; i < 17; ++i) {
            sum += text[i] * weightFactor[i];
        }
        mod = sum % 11;

        return (text[17] === verifyCode[mod]);
    },
    //QQ号码校验
    QCheck(text){
        return /^[1-9]\d{4,10}$/.test(text);
    },
    //邮箱校验
    emailCheck(text){
        return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(text);
    },
}