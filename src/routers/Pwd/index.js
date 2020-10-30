import React from "react";
import {connect} from "react-redux";
import AjaxAction from "../../actions/AjaxAction";
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Layout, notification, Row } from "antd";
import {Link} from "react-router-dom";
import Header from "../../components/Header/Header2";
const FormItem = Form.Item;

//设置密码页
class Pwd extends React.Component {
    //初始化数据
    state = {
        email: "",
        password: "",
    };

    find = () => {
        let {dispatch, router} = this.props;
        let {fresh} = this.state;
        let {email, origin, ticket} = this.props.location.query;
        dispatch(AjaxAction.find(email, origin, fresh, ticket)).then((data) => {
            if (data.result) {
                router.push('/login');
            }
        });
    };

    findEnter = (event) => {
        if (13 === event.charCode) {
            this.find();
        }
    };
    forgetEnter = (event) => {
        if (13 === event.charCode) {
            this.forget();
        }
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

    forget = () => {
        let {dispatch, router} = this.props;
        let {email} = this.state;
        // let url = window.location.href;
        let url = "http://logger.taillog.cn/#/";

        dispatch(AjaxAction.loginForget(email, url)).then((data) => {
            if (data.result) {
                this.openNotification("success", "找回密码邮件发送成功", "前往邮箱，点击邮件链接验证", 7);
                router.push('/login');
            } else {
                this.openNotification("warning", data.msg, "", 3);
            }
        });
    };

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    render() {
        let ticket = this.props.location.query.ticket;

        return (

            <Layout className={'layout'}>
                <Header />
                {   ticket ?
                    <div style={{margin: "auto"}} onKeyPress={this.findEnter}>                        {/*重置密码*/}
                        <Card className={'login-div'}>
                            <h1>重置密码</h1>
                            <Form className={'config-form'} onSubmit={this.handleSubmit}>
                                <FormItem>
                                    <Input
                                        id="fresh"
                                        placeholder="设置密码(6-20位字符)"
                                        addonBefore="密码"
                                        type="fresh"
                                        value={this.state.fresh}
                                        className={'config-form-input'}
                                        onChange={this.handleInputChange.bind(this, 'fresh')}
                                    />
                                </FormItem>
                                <Row>
                                    <Col span={8}/>
                                    <Col span={8}>
                                        <Button
                                            style={{width: "100%"}}
                                            type="primary"
                                            onClick={this.find}>找回密码</Button>
                                    </Col>
                                    <Col span={8}/>
                                </Row>
                                <div className="reg">
                                    <Link className="link" to="/login">登录</Link>
                                    &nbsp;&nbsp;
                                    <Link className="link" to="/reg">注册</Link>
                                </div>
                            </Form>
                        </Card>
                    </div>
                    :
                    <div style={{margin: "10% auto"}} onKeyPress={this.forgetEnter}>                        {/*发送重置邮件*/}
                        <Card className={'login-div'}>
                            <h1>找回密码</h1>
                            <Form className={'config-form'} onSubmit={this.handleSubmit}>
                                <FormItem>
                                    <Input
                                        id="email"
                                        placeholder="发送重置邮件"
                                        addonBefore="邮件"
                                        value={this.state.email}
                                        className={'config-form-input'}
                                        onChange={this.handleInputChange.bind(this, 'email')}
                                    />
                                </FormItem>
                                <Row>
                                    <Col span={8}/>
                                    <Col span={8}>
                                        <Button
                                            style={{width: "100%"}}
                                            type="primary"
                                            onClick={this.forget}>找回密码</Button>
                                    </Col>
                                    <Col span={8}/>
                                </Row>
                            </Form>
                            <div className="reg">
                                <Link className="link" to="/login">登录</Link>
                                &nbsp;&nbsp;
                                <Link className="link" to="/reg">注册</Link>
                            </div>
                        </Card>
                    </div>
                }
            </Layout>
        )
    }
}

export default connect((state) => ({state: state}))((Pwd));