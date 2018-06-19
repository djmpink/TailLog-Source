import React from "react";
import {connect} from "react-redux";
import {Button, Dropdown, Icon, Menu, message, Upload} from "antd";
import AjaxAction from "../../actions/AjaxAction";

const props = {
    name: 'file',
    action: '//jsonplaceholder.typicode.com/posts/',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        const hide = message.loading('导入配置信心，请稍后...', 0);
        setTimeout(hide, 1000);
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            let url = 'http://127.0.0.1:10777/upload?path=' + info.file.originFileObj.path;
            fetch(url, {
                method: 'get'
            }).then(function (response) {
                return response.text().then(function (text) {
                    return text;
                });
            }).then(function (resp) {
                message.success(`${info.file.name} 导入成功`);
            }).catch(function (err) {
                console.info(err);
            });
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 导入失败，请重试.`);
        }
    },
};


class Setting extends React.Component {
    logout = () => {
        const {dispatch, router} = this.props;
        dispatch(AjaxAction.logout()).then((data) => {
            if (data.result) {
                router.push('/login');
            }
        });
    };
    exportFile = () => {
        message.info("正在打包导出...");
        fetch('http://127.0.0.1:10777/zip', {
            method: 'get'
        }).then(function (response) {
            return response.text().then(function (text) {
                return text;
            });
        }).then(function (resp) {
            console.info(resp);
            let a = document.createElement('a');
            let url = "http://127.0.0.1:10777/download";
            a.href = url;
            a.click();
            window.URL.revokeObjectURL(url);
        }).catch(function (err) {
            console.info(err);
        });
    };
    importFile = () => {

    };
    setting = (e) => {
        let {router} = this.props;
        switch (e.key) {
            case "logout":
                this.logout();
                break;
            case "export":
                this.exportFile();
                break;
            case "login":
                router.push(e.key);
                break;
            case "userSetting"://下同
                router.push(e.key);
                break;
            case "help":
                // router.push(e.key);
                break;
            default:
                break
        }
    };

    render() {
        let token = localStorage['token'];
        return (
            <Dropdown
                overlay={
                    token ? <Menu onClick={this.setting}>
                        <Menu.Item style={{width: 100}} key="userSetting">
                            <Icon type="setting" style={{fontSize: 12, margin: "0 10px"}}/>
                            <span>设置</span>
                        </Menu.Item>
                        <Menu.Item style={{width: 100}} key="help">
                            <Icon type="question-circle-o" style={{fontSize: 12, margin: "0 10px"}}/>
                            <span>
                                <a href="http://www.taillog.cn/help.html" target="_blank"
                                   rel="noopener noreferrer">帮助</a>
                            </span>
                        </Menu.Item>
                        <Menu.Divider/>
                        <Menu.Item style={{width: 100}} key="logout">
                            <Icon type="logout" style={{fontSize: 12, margin: "0 10px"}}/> <span>退出</span>
                        </Menu.Item>

                    </Menu>
                        :
                        <Menu onClick={this.setting}>
                            <Menu.Item style={{width: 100}} key="export">
                                <Icon type="export" style={{fontSize: 12, margin: "0 10px"}}/>
                                <span>导出</span>
                            </Menu.Item>
                            <Menu.Item style={{width: 100}} key="import">
                                <Upload {...props}>
                                    <Icon type="upload" style={{fontSize: 12, margin: "0 10px"}}/>
                                    <span>导入</span>
                                </Upload>
                            </Menu.Item>
                            <Menu.Item style={{width: 100}} key="help">
                                <Icon type="question-circle-o" style={{fontSize: 12, margin: "0 10px"}}/>
                                <span>
                                <a href="http://www.taillog.cn/help.html" target="_blank"
                                   rel="noopener noreferrer">帮助</a>
                            </span>
                            </Menu.Item>
                            <Menu.Divider/>
                            <Menu.Item style={{width: 100}} key="login">
                                <Icon type="login" style={{fontSize: 12, margin: "0 10px"}}/> <span>登录</span>
                            </Menu.Item>
                        </Menu>

                }
                placement="bottomCenter">
                <Button type="primary" size="small" shape="circle" icon="setting"/>
            </Dropdown>
        )
    }
}

export default connect((state) => ({}))(Setting);
