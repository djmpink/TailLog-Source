import CommonAction from "./CommonAction";
import LoginAction from "./LoginAction";
import LogAction from "./LogAction";
import SettingAction from "./SettingAction";

export default {
    ...CommonAction,
    ...LoginAction,
    ...LogAction,
    ...SettingAction,
}