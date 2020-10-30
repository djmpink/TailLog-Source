import React from "react";
import {connect} from "react-redux";
import AjaxAction from "../../actions/AjaxAction";
import { CheckCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Layout, notification, Row } from "antd";
import {Link} from "react-router-dom";
const FormItem = Form.Item;
const {Header} = Layout;

//重置密码页
class Pwd extends React.Component {
    //初始化数据
    state = {
        email: "",
        password: "",
    };
    listenResetEnter = (event) => {
        if (13 === event.charCode) {
            this.reset();
        }
    };

    openNotification = () => {
        notification.open({
            message: <p style={{color: '#94a5e3'}}>密码修改成功 !</p>,
            icon: <CheckCircleOutlined style={{color: '#009e4a'}} />,
            duration: 2,
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
            this.reset();
        }
    };
    reset = () => {
        let {dispatch, router} = this.props;
        let {origin, fresh} = this.state;
        dispatch(AjaxAction.reset(null, origin, fresh, null)).then((data) => {
            if (data.result) {
                this.openNotification();
                setTimeout(() => {
                    router.push('/userSetting');
                }, 1000);

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
        return (
            <Layout className={'layout'}>
                <Header className={'layout-header'}>
                    <Button
                        shape="circle" icon={<LeftOutlined />}
                        type="primary"
                        onClick={() => {
                            let {router} = this.props;
                            router.push('/userSetting');
                        }}/>
                </Header>
                <div style={{margin: "auto"}} onKeyPress={this.listenEnter}>
                    <Card className={'login-div'}>
                        <h1>重置密码</h1>
                        <Form className={'config-form'} onSubmit={this.handleSubmit}>
                            <FormItem>
                                <Input
                                    id="origin"
                                    placeholder="输入旧密码"
                                    addonBefore="旧密码"
                                    className={'config-form-input'}
                                    onChange={this.handleInputChange.bind(this, 'origin')}
                                />
                            </FormItem>
                            <FormItem>
                                <Input
                                    id="fresh"
                                    placeholder="输入新密码"
                                    addonBefore="新密码"
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
                                        onClick={this.reset}>重置密码</Button>
                                </Col>
                                <Col span={8}/>
                            </Row>
                            <div className="reg">
                                <Link className="link" to="/userSetting">返回账户中心</Link>
                            </div>
                        </Form>
                    </Card>
                </div>
                }
            </Layout>
        );
    }
}

export default connect((state) => ({state: state}))((Pwd));