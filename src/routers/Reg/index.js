import React from "react";
import {connect} from "react-redux";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Layout, message, notification, Row, Spin } from "antd";
import {Link, withRouter} from "react-router-dom";
import Check from "../../utils/CheckList";
import AjaxAction from "../../actions/AjaxAction";
import "../Login/index.scss";
import Header from "../../components/Header/Header2";
import CopyRight from "../../components/CopyRight";
const FormItem = Form.Item;

//注册页
class Reg extends React.Component {
    //初始化数据
    state = {
        nickname: "",
        password: "",
        email: "",
        loading: false,
    };

    openNotification = (type, msg, desc, time) => {
        notification[type]({
            message: <p style={{color: '#94a5e3'}}>{msg} !</p>,
            description: desc,
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
            this.reg();
        }
    };

    reg = () => {
        this.setState({loading: true});
        let {dispatch, router} = this.props;
        let {email, nickname, password} = this.state;
        // let url = window.location.protocol + "//" + window.location.host + "/#/";
        let url = "http://logger.taillog.cn/#/";
        if (Check.username(nickname) && Check.password(password) && Check.emailCheck(email)) {
            dispatch(AjaxAction.reg(email, nickname, password, url)).then((data) => {
                this.setState({loading: false});
                if (data.result) {
                    this.openNotification("success", "注册邮件发送成功", "前往邮箱，点击邮件链接验证", 7);
                    router.push('/login');
                } else {
                    this.openNotification("warning", data.msg, "", 3);
                }
            });
        } else {
            this.setState({loading: false});
            message.warn("请输入用户名/密码");
        }
    };

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
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
                <Header />
                <div style={{margin: "auto"}} onKeyPress={this.listenEnter}>

                    <Card className={'login-div'}>
                        <Spin spinning={this.state.loading}>
                        <h1>注 册</h1>
                        <Form className={'config-form'} onSubmit={this.handleSubmit}>
                            <FormItem>
                                <Input
                                    id="nickname"
                                    addonBefore="昵称"
                                    value={this.state.nickname}
                                    className={'config-form-input'}
                                    onChange={this.handleInputChange.bind(this, 'nickname')}
                                />
                            </FormItem>
                            <FormItem>
                                <Input
                                    id="email"
                                    addonBefore="邮箱"
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
                                <Col span={8}/>
                                <Col span={8}>

                                    <Button
                                        style={{width: "100%"}}
                                        type="primary"
                                        onClick={this.reg}>注册</Button>

                                </Col>
                                <Col span={8}/>
                            </Row>
                            <div className="reg">
                                已有账号
                                <Link className="link" to="/login">立即登录</Link>
                            </div>
                        </Form>
                        </Spin>
                    </Card>

                </div>
                <CopyRight/>
            </Layout>
        )
    }
}

export default connect()(withRouter(Reg));