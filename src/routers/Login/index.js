import React from "react";
import {connect} from "react-redux";
import { SmileOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Layout, notification, Row, Spin } from "antd";
import CopyRight from "../../components/CopyRight";
import Check from "../../utils/CheckList";
import AjaxAction from "../../actions/AjaxAction";
import {Link, withRouter} from "react-router-dom";
import Header from "../../components/Header/Header2";
import "./index.scss";
const FormItem = Form.Item;

//登录页面
class Login extends React.Component {

    state = {//初始化数据
        email: "",
        password: "",
        loading: false,
    };
    openNotification = (type, msg, desc, time) => {
        notification[type]({
            message: <p style={{color: '#94a5e3'}}>{msg} !</p>,
            description: desc,
            icon: type === "warning" ? null : <SmileOutlined style={{color: '#94a5e3'}} />,
            duration: time,
            style: {
                width: 300,
                background: "rgba(163, 172, 206, 0.35)",
                color: "#ccc",
                marginTop: 0,
                marginLeft: -200,
            },
        });

    };

    listenEnter = (event) => {
        if (13 === event.charCode) {
            this.login();
        }
    };

    //action
    loginEnable = true;
    login = () => {
        if (!this.loginEnable) {
            return;
        }
        this.setState({loading: false});

        let {email, password} = this.state;
        let {dispatch, history} = this.props;
        let _this = this;
        if (Check.emailCheck(email) && Check.password(password)) {
            _this.loginEnable = false;

            dispatch(AjaxAction.login(email, password)).then((data) => {
                this.setState({loading: true});
                _this.loginEnable = true;
                if (data.result) {
                    this.openNotification("success", "Welcome !", "工欲善其事必先利其器 ^_^,", 3);
                    setTimeout(() => {
                        history.push("/config");
                    }, 1000);
                } else {
                    this.setState({loading: true});
                    this.openNotification("warning", data.msg, "", 3);
                }
            }).catch(() => {
                this.setState({loading: true});
                _this.loginEnable = true;
            });
        } else {
            this.openNotification("warning", "用户名/密码输入不正确", "", 3);
        }
    };

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    oauth2Login = (platform) => {
        let {dispatch} = this.props;
        dispatch(AjaxAction.oauth2Login(platform)).then((data) => {
            if (data.result) {
                document.location = data.data;
            }
        });
    };

    offLine = () => {
        this.props.history.push("/config");
    };

    componentDidMount() {
        let token = localStorage['token'];
        if (typeof(token) !== "undefined") {
            this.props.history.push("/config");
        }
    }

    render() {
        return (
            <Layout className={'layout'}>
                <Header {...this.props}/>
                <div style={{margin: "auto"}} onKeyPress={this.listenEnter}>
                    <Card className={'login-div'}>
                        <Spin spinning={this.state.loading}>
                            <Row>
                                <Col span={10}/>
                                <Col span={4} style={{textlign: "center"}}>
                                    <h1>登 录</h1>
                                </Col>
                                <Col span={4}/>
                                <Col span={6} style={{float: "right"}}>
                                </Col>
                            </Row>
                            <Form className={'config-form'} onSubmit={this.handleSubmit}>
                                <FormItem>
                                    <Input
                                        id="email"
                                        addonBefore="邮箱"
                                        placeholder="邮箱地址"
                                        value={this.state.email}
                                        className={'config-form-input'}
                                        onChange={this.handleInputChange.bind(this, 'email')}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Input
                                        id="password"
                                        placeholder="设置密码(6-20位字符)"
                                        addonBefore="密码"
                                        type="password"
                                        value={this.state.password}
                                        className={'config-form-input'}
                                        onChange={this.handleInputChange.bind(this, 'password')}
                                    />
                                </FormItem>
                                <Row>
                                    <Col span={9}/>
                                    <Col span={6}>
                                        <Button
                                            style={{width: "100%"}}
                                            type="primary"
                                            onClick={this.login}>登录</Button>
                                    </Col>
                                    <Col span={1}/>
                                    <Col span={4} style={{marginTop: 3}}>
                                        <Link className="link" to="/pwd">忘记密码</Link>
                                    </Col>
                                    <Col span={4} style={{marginTop: 3}}>
                                        <Link className="link" to="/reg">立即注册</Link>
                                    </Col>
                                </Row>
                            </Form>

                            <div className="third-login">
                                <p style={{color: "#888"}}>使用社交平台登录</p>
                                <Row>
                                    <Col span={9}/>
                                    <Col span={2}>
                                        <Button
                                            type="primary"
                                            onClick={this.oauth2Login.bind(this, "qq")}
                                            shape="circle"
                                            style={{marginRight: 10}}
                                        >
                                            <i className="fa fa-qq"/>
                                        </Button>
                                    </Col>
                                    <Col span={2}/>
                                    <Col span={2}>
                                        <Button
                                            type="primary"
                                            onClick={this.oauth2Login.bind(this, "github")}
                                            shape="circle"
                                            style={{marginRight: 10}}
                                        >
                                            <i className="fa fa-github" style={{fontSize: 20}}/>
                                        </Button>
                                    </Col>
                                    <Col span={9}/>
                                </Row>
                            </div>
                        </Spin>
                    </Card>
                </div>
                <CopyRight/>

            </Layout>
        )
    }
}

export default connect()(withRouter(Login));