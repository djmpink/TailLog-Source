import Ajax from "../utils/ajax.js";
import API from "../utils/ApiList";

const {
    ajaxCommon
} = Ajax;
const USER_SETTING_ACCOUNT = "USER_SETTING_ACCOUNT";//获取用户账户信息信息
const USER_SETTING_INFO = "USER_SETTING_INFO";//获取用户信息
const USER_SETTING_INFO_EDIT = "USER_SETTING_INFO_EDIT";//设置用户信息
const USER_SETTING_FEEDBACK = "USER_SETTING_FEEDBACK";//反馈意见

export default {
    USER_SETTING_ACCOUNT,
    userSettingAccount: () => {
        return ajaxCommon({
            api: API.UserSetting.account,
            success: (data) => ({
                type: USER_SETTING_ACCOUNT,
                data
            })
        });
    },
    USER_SETTING_INFO,
    userSettingInfo: () => {
        return ajaxCommon({
            api: API.UserSetting.info,
            success: (data) => ({
                type: USER_SETTING_INFO,
                data
            })
        });
    },
    USER_SETTING_INFO_EDIT,
    userSettingInfoEdit: (userInfoReq) => {
        return ajaxCommon({
            api: API.UserSetting.infoEdit,
            data: userInfoReq,
            success: (data) => ({
                type: USER_SETTING_INFO_EDIT,
                data,
            })
        });
    },
    USER_SETTING_FEEDBACK,
    feedback: (contact, suggest) => {
        return ajaxCommon({
            api: API.UserSetting.feedback,
            data: {contact, suggest},
            success: (data) => ({
                type: USER_SETTING_FEEDBACK,
                data
            })
        });
    },
}