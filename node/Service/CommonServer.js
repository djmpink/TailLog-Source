//封装返回数据
const response = (err, resp, date) => {
    if (err) {
        errorResponse(resp, err);
    } else {
        successResponse(resp, date);
    }
};

const successResponse = (resp, date) => {
    resp.send({
        "msg": "success",
        "result": true,
        "data": date
    });
};

const errorResponse = (resp, msg) => {
    resp.send({
        "msg": msg,
        "result": false
    });
};

module.exports = {
    successResponse,
    errorResponse,
    response
};