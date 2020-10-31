let common = require('./CommonServer');
let uuid = require('node-uuid');
const GROUP_URL = "/v1/log/config/group/";
const {db,dbPath} = require('../db');
const groupServer = function (app) {

    //----新增分组----//
    app.post(GROUP_URL + 'add', function (req, res) {
        let group = req.body;
        group.id = uuid.v1();
        group.createTime = new Date().getTime();
        group.modifyTime = new Date().getTime();
        group.isValid = true;
        db.t_group.insert(group, (err, newDoc) => {
            common.response(err, res, newDoc);
        });
    });

    //----编辑分组----//
    app.post(GROUP_URL + ':id/edit', function (req, res) {
        let group = req.body;
        let id = req.params.id;

        db.t_group.update({id: id, isValid: true}, {
            $set: {
                name: group.name,
                description: group.description,
                tags: group.tags,
                color: group.color,
                modifyTime: new Date().getTime()
            }
        }, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----删除分组----//
    app.post(GROUP_URL + ':id/remove', function (req, res) {
        let id = req.params.id;
        db.t_group.remove({id: id}, {}, function (err, numRemoved) {
            common.response(err, res, numRemoved);
        });
    });

    //----获取分组----//
    app.get(GROUP_URL + ':id', function (req, res) {
        let id = req.params.id;
        if (id === undefined) {
            common.errorResponse(null, "未获取分组详情");
            return;
        }
        db.t_group.findOne({id: id, isValid: true}, (err, doc) => {
            common.response(err, res, doc);
        });
    });

    //----获取分组下拉列表----//
    app.post(GROUP_URL + 'dropdown', function (req, res) {
        db.t_group.find({isValid: true})
            .sort({"createTime": -1})
            .exec(function (err, docs) {
                common.response(err, res, docs);
            });
    });

    //----获取分组列表----//
    app.post(GROUP_URL + 'list', function (req, res) {
        let query = req.body;
        db.t_group.count({isValid: true}, function (err, docs) {
            let total = docs;
            let offset = (query.page - 1) * query.pageSize;
            db.t_group.find({isValid: true})
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
    groupServer
};