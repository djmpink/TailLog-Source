
let express = require('express');
let Client = require('ssh2').Client;
let bodyParser = require('body-parser');

let app = express();
let fs = require('fs');
let path = require('path');
let JSZip = require("jszip");
let zip = new JSZip();


let {sshServer} = require('./Service/SSHServer');
let {agentServer} = require('./Service/AgentServer');
let {configServer} = require('./Service/ConfigServer');
let {groupServer} = require('./Service/GroupServer');
const {db,dbPath} = require('./db');

app.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
    extended: true
}));



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





//业务服务程序，提供配置信息的增删改查
const webServer = function () {

    //===config===//

    //设置跨域访问
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,auth-token');
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        next();
    });

    let server = app.listen(10777, function () {

        let host = server.address().address;
        let port = server.address().port;

        console.log("App instance, visit http://%s:%s", host, port)

    });

    //===server===//

    sshServer(app);
    configServer(app);
    groupServer(app);
    agentServer(app);

    //===others===//

    //接口：导入配置信息
    app.get('/upload', function (req, res) {
        let path = req.query.path;
        fs.readFile(path, function (err, data) {
            if (err) throw err;
            JSZip.loadAsync(data).then(function (zip) {
                return zip.file("t_ssh.json").async("string");
            }).then(function (txt) {
                fs.writeFile(dbPath + 't_ssh.db', txt, {}, function (err, data) {

                });
            });

            JSZip.loadAsync(data).then(function (zip) {
                return zip.file("t_agent.json").async("string");
            }).then(function (txt) {
                fs.writeFile(dbPath + 't_agent.db', txt, {}, function (err, data) {

                });
            });

            JSZip.loadAsync(data).then(function (zip) {
                return zip.file("t_group.json").async("string");
            }).then(function (txt) {
                fs.writeFile(dbPath + 't_group.db', txt, {}, function (err, data) {

                });
            });

            JSZip.loadAsync(data).then(function (zip) {
                return zip.file("t_config.json").async("string");
            }).then(function (txt) {
                fs.writeFile(dbPath + 't_config.db', txt, {}, function (err, data) {

                });
            });

            db.t_ssh.loadDatabase();
            db.t_group.loadDatabase();
            db.t_config.loadDatabase();
            db.t_agent.loadDatabase();
        });

        res.send({
            "msg": "success",
            "result": true,
            "data": true
        });
    });

    //接口：打包压缩配置信息
    app.get('/zip', function (req, res) {
        console.log("zip....");
        zip.file('t_ssh.json', fs.readFileSync(path.join(dbPath, 't_ssh.db')));
        zip.file('t_agent.json', fs.readFileSync(path.join(dbPath, 't_agent.db')));
        zip.file('t_group.json', fs.readFileSync(path.join(dbPath, 't_group.db')));
        zip.file('t_config.json', fs.readFileSync(path.join(dbPath, 't_config.db')));

        zip.generateAsync({type: "string"}).then(data => {
            fs.writeFileSync(dbPath + '/export.zip', data, 'binary');
        });

        res.send({
            "msg": "success",
            "result": true,
            "data": true
        });
    });

    //接口：下载（导出）配置信息
    app.get('/download', function (req, res) {
        console.log("download....");
        let file = dbPath + '/export.zip';
        res.download(file);
    });

    //接口：测试ssh连接
    app.post('/testSSH', function (req, res) {

        console.log("req:", req.body);

        let conn = new Client();
        let query = req.body;


        conn.on('ready', function () {
            res.send({
                "msg": "success",
                "result": true,
                "data": true
            });
        }).on('error', function (err) {
            console.warn(err);
            res.send({
                "msg": "error",
                "result": false,
                "data": false
            });
        }).connect(getConnectParams(query));
    });

    //接口：获取服务器文件目录
    app.post('/initDirectory', function (req, res) {
        let query = req.body;
        let conn = new Client();
        conn.on('ready', function () {

            conn.sftp(function (err, sftp) {
                if (err) throw err;
                sftp.readdir(query.path, function (err, list) {
                    if (err) throw err;
                    res.send({
                        "msg": "success",
                        "result": true,
                        "data": list
                    });
                    conn.end();
                });
            });
        }).on('error', function (err) {
            console.error(err);
            res.send({
                "msg": "error",
                "result": false,
                "data": false
            });
        }).connect(getConnectParams(query));
    });

};

module.exports = {
    webServer
};