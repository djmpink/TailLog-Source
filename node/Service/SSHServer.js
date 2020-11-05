let common = require('./CommonServer');
let uuid = require('node-uuid');
const SSH_URL = "/v1/log/config/ssh/";
const {db,dbPath} = require('../db');
const sshServer = function (app) {

    //----新增SSH配置----//
    app.post(SSH_URL + 'add', function (req, res) {
        let ssh = req.body;
        ssh.id = uuid.v1();
        ssh.createTime = new Date().getTime();
        ssh.modifyTime = new Date().getTime();
        ssh.isValid = true;
        db.t_ssh.insert(ssh, (err, newDoc) => {
            common.response(err, res, newDoc);
        });
    });

    //----编辑SSH配置----//
    app.post(SSH_URL + ':id/edit', function (req, res) {
        let ssh = req.body;
        let id = req.params.id;
        const {ip, port,username, password,name,privateKey,passphrase,loginType} = ssh;

        db.t_ssh.update({id: id, isValid: true}, {
            $set: {
                ip,
                port,
                username,
                password,
                name,
                privateKey,
                passphrase,
                loginType,
                modifyTime: new Date().getTime()
            }
        }, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----删除SSH配置----//
    app.post(SSH_URL + ':id/remove', function (req, res) {
        let id = req.params.id;
        db.t_ssh.remove({id: id}, {}, function (err, numRemoved) {
            common.response(err, res, numRemoved);
        });
    });

    //----获取SSH详情----//
    app.get(SSH_URL + ':id', function (req, res) {
        let id = req.params.id;
        if (id === undefined) {
            common.errorResponse(null, "未获取配置详情");
            return;
        }
        db.t_ssh.findOne({id: id, isValid: true}, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----获取SSH配置下拉列表----//
    app.post(SSH_URL + 'dropdown', function (req, res) {
        db.t_ssh.find({isValid: true})
            .sort({"createTime": -1})
            .exec(function (err, docs) {
                common.response(err, res, docs);
            });
    });

    //----获取SSH配置列表----//
    app.post(SSH_URL + 'list', function (req, res) {
        let query = req.body;
        db.t_ssh.count({isValid: true}, function (err, docs) {
            let total = docs;
            let offset = (query.page - 1) * query.pageSize;
            db.t_ssh.find({isValid: true})
                .sort({"createTime": -1})
                .skip(offset)
                .limit(query.pageSize)
                .exec(function (err, docs) {
                    let data = {
                        "list": docs,
                        "total": total,
                        "page": query.page,
                        "pageSize": query.pageSize
                    };
                    common.response(err, res, data);
                });
        });
    });
};
module.exports = {
    sshServer
};