let express = require('express');
let Client = require('ssh2').Client;
let bodyParser = require('body-parser');
let websocket = require("nodejs-websocket");
const TextDecoder = require('text-encoding').TextDecoder;
let app = express();
const {getConnectParams} =require('./common');

app.use(bodyParser.json({limit: '1mb'}));  //这里指定参数使用 json 格式
app.use(bodyParser.urlencoded({
    extended: true
}));
var termCols, termRows;
let conn = new Client();

//终端工具 服务
const termSSH = function () {

    //设置跨域访问
    app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild,auth-token');
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1');
        next();
    });

    app.post('/connect', function (req, res) {
        let query = req.body;
        conn = new Client();
        termCols = query.cols;
        termRows = query.rows;
        conn.end();
        conn.connect(getConnectParams(query));

        conn.on('ready', function () {
            console.log("===> connection ready");

            res.send({
                "msg": "success",
                "result": true,
                "data": true
            });

        });
        conn.on('error', function (err) {
            console.log("===> response err");
            res.send({
                "msg": "error",
                "result": false,
                "data": false
            });
        });

        conn.on('end', function connOnEnd(err) {
            console.log("===> connection end")
            conn.end();
        });
        conn.on('close', function connOnClose(err) {
            console.log("===> connection close")
            conn.end();
        })


    });

    let server = app.listen(10778, function () {

        let host = server.address().address;
        let port = server.address().port;

        console.log("Term instance, visit http://%s:%s", host, port)

    });


    let web = websocket.createServer(function (ws) {
        console.log('===> 创建 WebSocket');

        conn.shell({
            term: "xterm-color",
            cols: termCols
        }, function (err, stream) {
            if (err) throw err;

            ws.on("text", function (message) {
                stream.write(message);
            });

            stream.on('data', function (data) {
                try {
                    const decoder = new TextDecoder('utf-8');
                    const chunk = decoder.decode(data);
                    ws.sendText(chunk);
                } catch (e) {
                    console.log('===> WebSocket 已经关闭' + e);
                    conn.end();
                }
            });
            stream.on('close', function (code, signal) {
                console.log('===> connection close');
                conn.end();
            });
            stream.stderr.on('data', function (data) {
                console.log('===> connection stderr: ' + data);
                conn.end();
            });
        });

        ws.on("close", function (code, reason) {
            console.log("===> WebSocket closed");
            conn.end();
        });
        ws.on("error", function (code, reason) {
            console.log("===> WebSocket 异常关闭");
            conn.end();
        });

    }).listen(10779);
};
module.exports = {
    termSSH
};