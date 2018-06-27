const {webSocketServer} = require('../node/WebSocketServer');
const {webServer} = require('../node/WebServer');
const {termSSH} = require('../node/TermSSH');
//启动本地后端服务
webServer();//启动后台web服务
webSocketServer();//启动连接SSH服务器websocket服务
termSSH();//启动终端工具websocket服务