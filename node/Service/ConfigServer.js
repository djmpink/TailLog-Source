let common = require('./CommonServer');
let uuid = require('node-uuid');
let async = require("async");
const CONFIG_URL = "/v1/log/config/";

const {db,dbPath} = require('../db');
const configServer = function (app) {

    //----新增配置----//
    app.post(CONFIG_URL + 'add', function (req, res) {
        let ssh = req.body;
        ssh.id = uuid.v1();
        ssh.createTime = new Date().getTime();
        ssh.modifyTime = new Date().getTime();
        ssh.isValid = true;
        db.t_config.insert(ssh, (err, newDoc) => {
            common.response(err, res, newDoc);
        });
    });

    //----编辑配置----//
    app.post(CONFIG_URL + ':id/edit', function (req, res) {
        let config = req.body;
        let id = req.params.id;

        db.t_config.update({id: id, isValid: true}, {
            $set: {
                info: config.info,
                selectType: config.selectType,
                sshId: config.sshId,
                agentId: config.agentId,
                groupId: config.groupId,
                modifyTime: new Date().getTime()
            }
        }, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----删除配置----//
    app.post(CONFIG_URL + ':id/remove', function (req, res) {
        let id = req.params.id;
        db.t_config.remove({id: id}, {}, function (err, numRemoved) {
            common.response(err, res, numRemoved);
        });
    });

    //----获取详情----//
    function getConfig(id, callback) {
        if (id === undefined) {
            common.errorResponse(null, "未获取配置详情");
            return;
        }
        db.t_config.findOne({id: id, isValid: true}, (err, config) => {
            let resp = {};
            resp.id = config.id;
            resp.info = config.info;
            resp.sshId = config.sshId;
            resp.agentId = config.agentId;
            resp.groupId = config.groupId;
            resp.selectType = config.selectType;
            callback(null, resp);
        });
    }

    function getSource(resp, callback) {
        switch (resp.selectType) {
            case 1:
                db.t_ssh.findOne({id: resp.sshId, isValid: true}, (err, ssh) => {
                    if (ssh) {
                        resp.sshIP = ssh.ip;
                        resp.sshName = ssh.name;
                        resp.ssh = ssh;
                    }
                    callback(null, resp);
                });
                break;
            case 2:
                async.series({
                    ssh: function (callback) {
                        db.t_ssh.findOne({id: resp.sshId, isValid: true}, (err, ssh) => {
                            callback(null, ssh);
                        });
                    },
                    agent: function (callback) {
                        db.t_agent.findOne({id: resp.agentId, isValid: true}, (err, agent) => {
                            callback(null, agent);
                        });
                    },
                }, function (err, results) {
                    const {ssh, agent} = results;
                    if (ssh) {
                        resp.sshIP = ssh.ip;
                        resp.sshName = ssh.name;
                        resp.ssh = ssh;
                    }
                    if (agent) {
                        resp.agentIP = agent.ip;
                        resp.agentName = agent.name;
                        resp.agent = agent;
                    }
                    callback(null, resp);
                });
                break;
            default:
                callback(null, resp);
        }
    }

    function getGroup(resp, callback) {
        db.t_group.findOne({id: resp.groupId, isValid: true}, (err, doc) => {
            if (err) {
                callback(null, resp);
            }
            resp.group = doc;
            callback(null, resp);
        });
    }

    app.get(CONFIG_URL + ':id', function (req, res) {
        let id = req.params.id;
        async.waterfall([
            function (callback) {
                getConfig(id, callback);
            },
            function (resp, callback) {
                getSource(resp, callback);
            },
            function (resp, callback) {
                getGroup(resp, callback);
            }
        ], function (err, result) {
            common.response(err, res, result);
        });
    });

    //----获取配置下拉列表----
    app.post(CONFIG_URL + 'dropdown', function (req, res) {
        db.t_config.find({isValid: true})
            .sort({"createTime": -1})
            .exec(function (err, docs) {
                async.map(docs, iterator, function (err, result) {
                    common.successResponse(res, result);
                });
            });
    });

    //----获取配置列表----//
    app.post(CONFIG_URL + 'list', function (req, res) {
        let query = req.body;
        let criteria = {"isValid": true};
        if (query.type) {
            criteria.selectType = {"$in": query.type.map(one => Number(one))};
        }
        if (query.groupName && query.groupName.length > 0) {
            let flag = false;

            for (let i = 0; i < query.groupName.length; i++) {
                if (query.groupName[i] === "-1") {
                    flag = true;
                    break;
                }
            }
            if (flag) {
                criteria['$or'] = [{"groupId": {"$exists": false}}, {"groupId": {"$in": query.groupName}}];

            } else {
                criteria.groupId = {"$in": query.groupName};
            }
        }

        if (query.searchVal) {
            const req = new RegExp(query.searchVal, "i");
            criteria['$or'] = [{"info.name": {"$regex": req}}, {"info.path": {"$regex": req}}];
        }
        async.series({
            total: function (callback) {
                db.t_config.count(criteria
                    , function (err, docs) {
                        callback(null, docs);
                    })
            },

            list: function (callback) {
                let offset = (query.page - 1) * query.pageSize;

                db.t_config.find(criteria
                )
                    .sort({"createTime": -1})
                    .skip(offset)
                    .limit(query.pageSize)
                    .exec(function (err, docs) {
                        callback(null, docs);
                    });

            },
        }, function (err, results) {
            const {list, total} = results;
            async.map(list, iterator, function (err, result) {
                let data = {
                    "list": result,
                    "total": total,
                    "page": query.page,
                    "pageSize": query.pageSize
                };

                common.successResponse(res, data);
            });
        });

    });

    let iterator = function (config, callback) {
        let resp = {};
        resp.id = config.id;
        resp.name = config.info.name;
        resp.path = config.info.path;
        resp.createTime = config.createTime;
        resp.modifyTime = config.modifyTime;
        async.waterfall([
            function (callback) {
                switch (config.selectType) {
                    case 1:
                        db.t_ssh.findOne({id: config.sshId, isValid: true}, (err, ssh) => {
                            if (ssh) {
                                resp.ip = ssh.ip;
                                resp.ipName = ssh.name;
                                resp.type = "SHELL";
                                resp.sshId = ssh.id;
                            }
                            callback(null, resp);
                        });

                        break;
                    case 2:
                        async.series({
                            ssh: function (callback) {
                                console.log(config.sshId)
                                if (config.sshId !== undefined) {
                                    db.t_ssh.findOne({id: config.sshId, isValid: true}, (err, ssh) => {
                                        callback(null, ssh);
                                    });
                                }else {
                                    callback(null, null);
                                }
                            },
                            agent: function (callback) {
                                if (config.agentId !== undefined) {
                                    db.t_agent.findOne({id: config.agentId, isValid: true}, (err, agent) => {
                                        callback(null, agent);
                                    });
                                }else {
                                    callback(null, null);
                                }
                            },
                        }, function (err, results) {
                            const {ssh, agent} = results;
                            resp.type = "AGENT";
                            if (ssh) {
                                resp.sshIP = ssh.ip;
                                resp.sshName = ssh.name;
                                resp.ssh = ssh;
                            }
                            if (agent) {
                                resp.ip = agent.ip;
                                resp.ipName = agent.name;
                                resp.agentId = agent.id;

                                resp.agentIP = agent.ip;
                                resp.agentName = agent.name;
                                resp.agent = agent;
                            }
                            callback(null, resp);
                        });
                        break;
                    case 3:
                        resp.type = "FILE";
                        callback(null, resp);
                        break;
                    default:
                        callback(null, resp);
                }
            },
            function (resp, callback) {

                db.t_group.findOne({id: config.groupId, isValid: true}, (err, doc) => {
                    if (err) {
                        callback(null, resp);
                    }
                    if (doc) {
                        resp.groupName = doc.name;
                    }
                    callback(null, resp);
                });

            }
        ], function (err, result) {
            callback(err, result);
        });
    };

};
module.exports = {
    configServer
};