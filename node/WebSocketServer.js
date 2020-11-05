let Client = require('ssh2').Client;
let websocket = require("nodejs-websocket");
const {getConnectParams} =require('./common');

//ssh连接，通过WebSocket实时传输日志信息
const webSocketServer = function () {

    let server = websocket.createServer(function (ws) {

        ws.on("text", function (message) {
            console.log("===> request params:", message);
            let msg = JSON.parse(message.toString());
            let ssh = msg.ssh;
            if (ssh === null) {
                return;
            }

            let conn = new Client();
            conn.connect(getConnectParams(ssh));

            conn.on('ready', function () {
                console.log('===>  connection ready');

                let cmd = msg.content;
                console.log('===>  cmd :', cmd + "");

                conn.exec(cmd + "", function (err, stream) {
                    if (err) throw err;
                    stream.on('close', function (code, signal) {
                        console.log('===> close: code: ' + code + ', signal: ' + signal);
                        conn.end();
                    }).on('data', function (data) {
                        try {
                            ws.sendText("" + data);
                        } catch (e) {
                            console.log('===> WebSocket already closed' + e);
                            conn.end();
                        }

                    }).stderr.on('data', function (data) {
                        console.log('===> exception: ' + data);
                    });
                });
            })
        });
        ws.on("close", function (code, reason) {
            console.log("connection closed")
        });
        ws.on("error", function (code, reason) {
            console.log("close exception")
        });
    }).listen(10776);
};

module.exports = {
    webSocketServer
};