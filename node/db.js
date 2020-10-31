const os = require('os');
let nedb = require('nedb');
let dbPath = os.homedir() + "/.taillog/.database/";//本地数据库地址（可修改）

//初始化数据库
let db = {};
db.t_ssh = new nedb({filename: dbPath + 't_ssh.db', autoload: true});
db.t_agent = new nedb({filename: dbPath + 't_agent.db', autoload: true});
db.t_group = new nedb({filename: dbPath + 't_group.db', autoload: true});
db.t_config = new nedb({filename: dbPath + 't_config.db', autoload: true});

module.exports = {
    db,
    dbPath,
};
