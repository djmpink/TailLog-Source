let common = require('./CommonServer');
let uuid = require('node-uuid');
const AGENT_URL = "/v1/log/config/agent/";
const {db,dbPath} = require('../db');
const agentServer = function (app) {

    //----新增代理配置----//
    app.post(AGENT_URL + 'add', function (req, res) {
        let agent = req.body;
        agent.id = uuid.v1();
        agent.createTime = new Date().getTime();
        agent.modifyTime = new Date().getTime();
        agent.isValid = true;
        db.t_agent.insert(agent, (err, newDoc) => {
            common.response(err, res, newDoc);
        });
    });

    //----编辑代理配置----//
    app.post(AGENT_URL + ':id/edit', function (req, res) {
        let agent = req.body;
        let id = req.params.id;

        db.t_agent.update({id: id, isValid: true}, {
            $set: {
                ip: agent.ip,
                port: agent.port,
                name: agent.name,
                modifyTime: new Date().getTime()
            }
        }, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----删除代理配置----//
    app.post(AGENT_URL + ':id/remove', function (req, res) {
        let id = req.params.id;
        db.t_agent.remove({id: id}, {}, function (err, numRemoved) {
            common.response(err, res, numRemoved);
        });
    });

    //----获取代理配置详情----//
    app.get(AGENT_URL + ':id', function (req, res) {
        let id = req.params.id;
        if (id === undefined) {
            common.errorResponse(null, "未获取配置详情");
            return;
        }
        db.t_agent.findOne({id: id, isValid: true}, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----获取代理配置下拉列表----//
    app.post(AGENT_URL + 'dropdown', function (req, res) {
        db.t_agent.find({isValid: true})
            .sort({"createTime": -1})
            .exec(function (err, docs) {
                common.response(err, res, docs);
            });
    });

    //----获取配置列表----//
    app.post(AGENT_URL + 'list', function (req, res) {
        let query = req.body;
        db.t_agent.count({isValid: true}, function (err, docs) {
            let total = docs;
            let offset = (query.page - 1) * query.pageSize;
            db.t_agent.find({isValid: true})
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
    agentServer
};