import React, {Component} from "react";
import {connect} from "react-redux";
import { EyeOutlined, LinkOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {Button, Card, Col, Input, message, Radio, Row, Spin, Tooltip} from "antd";
import AjaxAction from "../../actions/AjaxAction";

const FormItem = Form.Item;
const defaultState = {
    loading: false,
    loginType:'password', // 登陆方式: password privateKey
};

class SSH extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ...defaultState,
            ...props.ssh,

        };
    }

    loginTypeChange = (e)=>{
        const {value} = e.target;
        this.setState({
            loginType: value,
        })
    }

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    getAllData = ()=>{
        let formData = Object.assign({}, this.state);
        const {ip,port, username, name, password, privateKey, passphrase, loginType} = formData;
        let values = {
            ip,
            port: port || '22', //ssh默认使用22端口
            username,
            name,
            loginType,
        };
        // 密码方式登陆才存密码，否则存储的是userKey
        if(loginType === 'password'){
            values.password = password;
        }else if(loginType === 'privateKey'){
            values.privateKey = privateKey;
            passphrase && (values.passphrase = passphrase);
        }
        return values;
    }

    handleTestSSH = () => {
        let {dispatch} = this.props;

        const values = this.getAllData();

        this.setState({loading: true}, () => {
            dispatch(AjaxAction.sshConnect(values)).then((data) => {
                this.setState({loading: false});
                if (data.result) {
                    message.success("连接成功", 2);
                } else {
                    message.error("连接失败", 2);
                }
            }).catch((e) => {
                this.setState({loading: false});
                console.error(e);
            })
        });

    };

    handleSubmit = (e) => {
        e.preventDefault();
        let {dispatch, ssh = {}} = this.props;
        let _this = this;

        let formData = Object.assign({}, this.state);
        if (!formData.ip || formData.ip === "") {
            message.warn("IP 不能为空", 3);
            return;
        }
        const values = this.getAllData();

        if (ssh.id) {
            dispatch(AjaxAction.configSSHEdit(ssh.id, values)).then((data) => {
                if (data.result) {
                    message.success("编辑成功", 1.5, () => {
                        this.setState(defaultState);
                        _this.props.closeCallback && _this.props.closeCallback();
                    });

                } else {
                    message.error(data.msg);
                }
            }).catch((e) => {
                console.error(e);
            })
        } else {
            dispatch(AjaxAction.configSSHAdd(values)).then((data) => {
                if (data.result) {
                    message.success("添加成功", 1.5, () => {
                        this.setState(defaultState);
                        _this.props.closeCallback && _this.props.closeCallback();
                    });

                } else {
                    message.error(data.msg);
                }
            }).catch((e) => {
                console.error(e);
            })
        }
    };

    render() {

        return (
            <div>
                <div style={{marginTop: 15}}>
                    <Spin spinning={this.state.loading} size="large">
                        <Card
                            title="配置SSH"
                            bordered={false}
                            bodyStyle={{
                                backgroundColor: "#343842",
                                color: "#888",
                                cursor: "pointer",
                                // borderTop: "1px solid #2bb669"
                            }}
                        >

                            <Form className={'config-form'} onSubmit={this.handleSubmit}>
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="ip"
                                                addonBefore="服务IP"
                                                value={this.state.ip}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'ip')}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem>

                                            <Input
                                                id="port"
                                                addonBefore="端口"
                                                value={this.state.port}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'port')}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="username"
                                                addonBefore="用户名"
                                                value={this.state.username}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'username')}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem>
                                            <div>
                                                <Radio.Group onChange={this.loginTypeChange} value={this.state.loginType}>
                                                    <Radio value={'password'}>
                                                        密码
                                                    </Radio>
                                                    <Radio value={'privateKey'}>
                                                        用户私钥
                                                    </Radio>
                                                </Radio.Group>
                                            </div>

                                            {this.state.loginType === 'password' &&
                                            <Input
                                                id="password"
                                                addonBefore="密码"
                                                type="password"
                                                value={this.state.password}
                                                className={'config-form-input'}
                                                style={{background: "#3e434e", borderWidth: 0}}
                                                onChange={this.handleInputChange.bind(this, 'password')}
                                                suffix={
                                                    <Tooltip title={this.state.password} placement="topRight">
                                                        <EyeOutlined style={{color: '#888'}} />
                                                    </Tooltip>}
                                            />
                                            }
                                            {this.state.loginType === 'privateKey' &&
                                            <>

                                                <Input
                                                    addonBefore={'用户私钥'}
                                                    type={"text"}
                                                    placeholder={"请复制私钥的完整路径到此处"}
                                                    onChange={this.handleInputChange.bind(this, 'privateKey')}
                                                    value={this.state.privateKey}

                                                />
                                                <Input
                                                    addonBefore={'私钥密码'}
                                                    type={'password'}
                                                    placeholder={'请输入私钥的密码，如果未设置，请留空'}
                                                    onChange={this.handleInputChange.bind(this,'passphrase')}
                                                    value={this.state.passphrase}
                                                />
                                            </>

                                            }



                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="name"
                                                addonBefore="名称"
                                                value={this.state.name}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'name')}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>

                                        <Tooltip title="连接测试" placement="right">

                                            <Button
                                                onClick={this.handleTestSSH}
                                                shape="circle"
                                                type="primary"
                                                icon={<LinkOutlined />}
                                                ghost/>

                                        </Tooltip>

                                    </Col>
                                </Row>
                                <div style={{margin: 20, textAlign: "center"}}>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        style={{width: "30%", fontSize: 14}}
                                        ghost
                                    >
                                        保 存
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Spin>
                </div>

            </div>
        );
    }

}

export default connect((state) => ({
    ssh: state.ssh,
}))(SSH);