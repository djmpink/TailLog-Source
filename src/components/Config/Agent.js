import React, {Component} from "react";
import {connect} from "react-redux";
import { PlusOutlined, QuestionCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, message, Row, Select, Tooltip } from "antd";
import AjaxAction from "../../actions/AjaxAction";
import Source from "../../components/Source";
const Option = Select.Option;
const FormItem = Form.Item;
const defaultState = {
    show: false,
    agentDropdown: [],
    sshDropdown: [],
    groupDropdown: []
};

class Agent extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ...defaultState,
            ...props.currentConfig.info,
        };
    }

    //添加配置
    showAddSource = (sourceType) => {
        this.setState({
            show: true,
            sourceType: sourceType
        });
    };

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    handleSelectChange = (value, option) => {
        this.setState({
            [value]: option
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        let {dispatch, currentConfig} = this.props;
        let _this = this;

        let formData = Object.assign({}, this.state);
        if (!formData.agentId || formData.agentId === "") {
            message.warn("请选择代理服务器", 3);
            return;
        }
        // if (!formData.sshId || formData.sshId === "") {
        //     message.warn("请选择SSH", 3);
        //     return;
        // }
        let values = {
            selectType: 2,
            info: {
                name: formData.name,
                path: formData.path,
                tags: formData.tags,
                rule: formData.rule
            },
            groupId: formData.groupId,
            agentId: formData.agentId,
            sshId: formData.sshId,
        };

        if (currentConfig.id) {
            dispatch(AjaxAction.configEdit(currentConfig.id, values)).then((data) => {
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
            dispatch(AjaxAction.configAdd(values)).then((data) => {
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

    handleTest = (e) => {
        e.preventDefault();
    };

    getAgentDropdown = () => {
        const {dispatch} = this.props;
        dispatch(AjaxAction.configAgentDropDown()).then((data) => {
            this.setState({
                agentDropdown: data.data
            });
        }).catch(() => {
        });
    };

    getSSHDropdown = () => {
        const {dispatch} = this.props;
        dispatch(AjaxAction.configSSHDropDown()).then((data) => {
            this.setState({
                sshDropdown: data.data
            });
        }).catch(() => {
        });
    };
    getGroupDropdown = () => {
        const {dispatch} = this.props;
        dispatch(AjaxAction.configGroupDropDown()).then((data) => {
            this.setState({
                groupDropdown: data.data
            });
        }).catch(() => {
        });
    };

    componentWillReceiveProps(props) {
        this.setState({
            ...props.currentConfig.info,
            agentId: props.currentConfig.agentId,
            agentIP: props.currentConfig.agentIP,
            sshId: props.currentConfig.sshId,
            sshIP: props.currentConfig.sshIP,
            groupId: props.currentConfig.groupId

        })
    }

    componentDidMount() {
        this.getAgentDropdown();
        this.getSSHDropdown();
        this.getGroupDropdown();
    }

    render() {
        const {sshDropdown, agentDropdown, groupDropdown} = this.state;

        return (
            <div>
                <div>
                    <Card
                        title="配置代理"
                        bordered={false}
                        bodyStyle={{
                            backgroundColor: "#343842",
                            color: "#888",
                            cursor: "pointer",
                        }}
                    >
                        <Form className={'config-form'} layout={'vertical'}>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <FormItem hasFeedback>
                                        <Select
                                            placeholder="选择代理服务器"
                                            value={this.state.agentId}
                                            onSelect={this.handleSelectChange.bind(this, 'agentId')}
                                        >
                                            {
                                                agentDropdown && agentDropdown.map(d => {
                                                    return (
                                                        <Option key={d.id} value={d.id}>
                                                            {d.ip + ":" + d.port + " (" + d.name + ")"}
                                                        </Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={8}>
                                    <Tooltip title="新增代理服务器" placement="right">
                                        <Button
                                            onClick={this.showAddSource.bind(this, 2)}
                                            shape="circle"
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            ghost/>
                                    </Tooltip>
                                </Col>
                                <Col span={4}/>
                            </Row>
                        </Form>
                    </Card>
                </div>
                {/* <div style={{marginTop: 15}}>
                 <Card
                 title="配置SSH (选配)"
                 extra={ <Tooltip title="如果选择了该配置，则代理程序可以优先使用该配置访问被代理的日志地址" placement="left">
                 <Icon style={{color: "#ffbf00"}}
                 type="question-circle"/>
                 </Tooltip>}
                 bordered={false}
                 bodyStyle={{
                 backgroundColor: "#343842",
                 color: "#888",
                 cursor: "pointer",
                 }}
                 >
                 <Form className={'config-form'} layout={'vertical'}>
                 <Row gutter={32}>
                 <Col span={12}>
                 <FormItem hasFeedback>
                 <Select
                 value={this.state.sshId}
                 placeholder="选择SSH配置"
                 onSelect={this.handleSelectChange.bind(this, 'sshId')}
                 >
                 {
                 sshDropdown.map(d => {
                 return (
                 <Option key={d.id} value={d.id}>
                 {d.username + "@" + d.ip + " (" + d.name + ")"}
                 </Option>
                 )
                 })
                 }
                 </Select>
                 </FormItem>
                 </Col>
                 <Col span={8}>
                 <Tooltip title="新增SSH配置" placement="right">
                 <Button
                 onClick={this.showAddSource.bind(this, 1)}
                 shape="circle"
                 type="primary"
                 icon="plus"
                 ghost/>
                 </Tooltip>
                 </Col>
                 <Col span={4}/>
                 </Row>
                 </Form>
                 </Card>
                 </div>*/}
                <div style={{marginTop: 15}}>
                    <Card
                        title="日志信息"
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
                                            id="name"
                                            addonBefore="服务名称"
                                            value={this.state.name}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'name')}
                                        />

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>

                                        <Input
                                            id="path"
                                            addonBefore="文件路径"
                                            value={this.state.path}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'path')}
                                        />
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <FormItem>

                                        <Input
                                            id="tags"
                                            addonBefore="标签"
                                            value={this.state.tags}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'tags')}
                                        />

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem hasFeedback>
                                        <Select
                                            placeholder="选择分组"
                                            value={this.state.groupId}
                                            onSelect={this.handleSelectChange.bind(this, 'groupId')}
                                        >
                                            {
                                                groupDropdown && groupDropdown.map(d => {
                                                    return (
                                                        <Option key={d.id} value={d.id}>
                                                            {d.name}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>

                            </Row>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <FormItem hasFeedback>
                                        <Select
                                            value={this.state.sshId}
                                            placeholder="选择SSH配置(选填)"
                                            onSelect={this.handleSelectChange.bind(this, 'sshId')}
                                        >
                                            {
                                                sshDropdown && sshDropdown.map(d => {
                                                    return (
                                                        <Option key={d.id} value={d.id}>
                                                            {d.username + "@" + d.ip + " (" + d.name + ")"}
                                                        </Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={2}>
                                    <Tooltip title="新增SSH配置" placement="right">
                                        <Button
                                            onClick={this.showAddSource.bind(this, 1)}
                                            shape="circle"
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            ghost/>
                                    </Tooltip>
                                </Col>
                                <Col span={1} style={{marginTop: 5}}>
                                    <Tooltip title="如果选择了该配置，则代理程序可以优先使用该配置访问被代理的日志地址" placement="top">
                                        <QuestionCircleOutlined style={{color: "#ffbf00"}} />
                                    </Tooltip>
                                </Col>
                                <Col span={9}/>
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

                <Source
                    show={this.state.show}
                    sourceType={this.state.sourceType}
                    breadcrumb={3}
                    closeSource={() => {
                        this.getAgentDropdown();
                        this.getSSHDropdown();
                        this.getGroupDropdown();
                        this.setState({show: false})
                    }}/>
            </div>
        );
    }
}

export default connect((state) => ({
    currentConfig: state.currentConfig,
}))(Agent);
