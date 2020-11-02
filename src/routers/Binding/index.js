import React from "react";
import {connect} from "react-redux";
import { LeftOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Layout, notification, Row } from "antd";
import AjaxAction from "../../actions/AjaxAction";
import "../Login/index.scss";
import {withRouter} from "react-router";
const {Header} = Layout;
const FormItem = Form.Item;

//绑定邮箱页
class Binding extends React.Component {

    //初始化数据
    state = {
        email: "",
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
            this.binding();
        }
    };
    binding = () => {
        let {dispatch, history} = this.props;
        let {email} = this.state;
        // let url = window.location.href;
        let url = "http://logger.taillog.cn/#/";
        dispatch(AjaxAction.binding(email, url)).then((data) => {
            if (data.result) {
                this.openNotification("success", "设置登录邮箱邮件发送成功", "前往邮箱，点击邮件链接验证", 7);
                history.push('/userSetting');
            } else {
                this.openNotification("warning", data.msg, "", 3);
            }
        });
    };


    componentDidMount() {
        let {dispatch} = this.props;
        let {email, ticket} = this.props.location.query;
        if (ticket === null) {
            return;
        }
        dispatch(AjaxAction.bindingActivate(email, ticket)).then((data) => {
            if (data.success) {
                setTimeout(() => {
                    this.goAccount();
                }, 3000)
            }
        });
    }

    goAccount = () => {
        let {history} = this.props;
        history.push('/userSetting');
    };
    handleInputChange = (key, event) => {
        const {target} = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    render() {
        let ticket = this.props.location.query.ticket;

        return (
            <Layout className={'layout'}>
                <Header className={'layout-header'}>
                    <Button
                        shape="circle" icon={<LeftOutlined />}
                        type="primary"
                        onClick={() => {
                            let {history} = this.props;
                            history.push('/userSetting');
                        }}/>
                </Header>
                <div style={{margin: "auto"}} onKeyPress={this.listenEnter}>
                    {   ticket ?
                        <Card className={'login-div'}>
                            <h1>设置成功</h1>
                            <Row>
                                <Col span={8}/>
                                <Col span={8}>
                                    <Button
                                        style={{width: "100%"}}
                                        type="primary"
                                        onClick={this.goAccount}>返回账户</Button>
                                </Col>
                                <Col span={8}/>
                            </Row>
                        </Card>

                        :

                        <Card className={'login-div'}>
                            <h1>设置邮件</h1>
                            <Form className={'config-form'}>
                                <FormItem>
                                    <Input
                                        id="email"
                                        addonBefore="新邮箱"
                                        value={this.state.email}
                                        className={'config-form-input'}
                                        onChange={this.handleInputChange.bind(this, 'email')}
                                    />
                                </FormItem>
                            </Form>
                            <Row>
                                <Col span={8}/>
                                <Col span={8}>
                                    <Button
                                        style={{width: "100%"}}
                                        type="primary"
                                        onClick={this.binding}>设置</Button>
                                </Col>
                                <Col span={8}/>
                            </Row>
                        </Card>
                    }
                </div>
            </Layout>
        );
    }
}

export default connect((state) => ({state: state}))((withRouter(Binding)));