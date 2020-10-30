import React, {Component} from "react";
import {connect} from "react-redux";
import { LinkOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, message, Row, Tooltip } from "antd";
import AjaxAction from "../../actions/AjaxAction";

const FormItem = Form.Item;
const defaultState = {};

class Agent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ...defaultState,
            ...props.agent
        };
    }

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        let {dispatch, agent = {}} = this.props;
        let _this = this;

        let formData = Object.assign({}, this.state);
        if (!formData.ip || formData.ip === "") {
            message.warn("IP 不能为空", 3);
            return;
        }
        if (!formData.port || formData.port === "") {
            message.warn("端口 不能为空", 3);
            return;
        }
        let values = {
            ip: formData.ip,
            port: formData.port,
            name: formData.name
        };

        if (agent.id) {
            dispatch(AjaxAction.configAgentEdit(agent.id, values)).then((data) => {
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
            dispatch(AjaxAction.configAgentAdd(values)).then((data) => {
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
                    <Card
                        title="配置代理"
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
                                            onClick={() => {
                                                message.info("test", 2)
                                            }}
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
                </div>

            </div>
        );
    }

}

export default connect((state) => ({
    agent: state.agent
}))(Agent);