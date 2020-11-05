let fs = require('fs');
const getConnectParams = function (query){
    const {privateKey, passphrase} = query;
    let params = {
        host: query.ip + "",
        port: Number(query.port),
        username: query.username + "",
        // password: query.password + ""
    }
    // 目前privateKey只是一个路径，需要解析
    if(privateKey){
        params.privateKey = fs.readFileSync(privateKey);
        passphrase && (params.passphrase = passphrase);

    }else {
        params.password= query.password + ""
    }
    return params;
}
module.exports = {
    getConnectParams,
}