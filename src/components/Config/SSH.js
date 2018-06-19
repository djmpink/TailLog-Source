import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Card, Col, Form, Icon, Input, message, Modal, Row, Select, Tooltip, Tree} from "antd";
import AjaxAction from "../../actions/AjaxAction";
import Source from "../../components/Source";
import "./index.scss";
const TreeNode = Tree.TreeNode;

const Option = Select.Option;
const FormItem = Form.Item;
const defaultState = {
    port: "22",
    sshDropdown: [],
    groupDropdown: [],
    treeData: [],
    checkedKeys: [],
    selectedKeys: [],
};
const url = "http://127.0.0.1:10777/initDirectory";
class SSH extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const {currentConfig = {}} = props;
        this.state = {
            ...defaultState,
            ...currentConfig.info,
            sshId: currentConfig.sshId,
            visible: false
        };
    }

    showModal = () => {
        if (this.state.sshId === undefined) {
            message.warn("请先选择SSH", 2);
            return null;
        }
        this.setState({
            visible: true,
        });

        this.initDirectory('/');
    };
    handleOk = (e) => {
        this.setState({
            visible: false,
            treeData: [],
        });
    };
    handleCancel = (e) => {
        this.setState({
            visible: false,
            treeData: [],
        });
    };

    getSSH = () => {
        let _this = this;
        if (_this.state.sshId === undefined) {
            message.warn("请先选择SSH", 2);
            return null;
        }
        let index = this.state.sshDropdown.findIndex(function (value, index, arr) {
            return value.id === _this.state.sshId;
        });
        return this.state.sshDropdown[index];
    };

    onLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }

            let _this = this;
            let ssh = this.getSSH();
            if (ssh === null) {
                return;
            }
            const path = treeNode.props.dataRef.key + '/';
            let values = {
                ip: ssh.ip,
                port: ssh.port,
                username: ssh.username,
                password: ssh.password,
                name: ssh.name,
                path: "/" + path
            };
            let _treeNode = treeNode;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(function (res) {
                res.json().then(function (data) {
                    // console.log(data);
                    let list = [];
                    let res = data.data;
                    // console.log(res);
                    let length = res.length;
                    for (let i = 0; i < length; i++) {
                        const one = data.data[i];
                        let obj = {
                            title: one.filename,
                            key: path + one.filename,
                            isLeaf: one.longname[0] !== 'd'
                        };
                        list.push(obj);
                    }

                    _treeNode.props.dataRef.children = list;
                    _this.setState({
                        treeData: [..._this.state.treeData],
                    });
                    resolve();
                });
            });
        });
    };

    initDirectory = (path) => {
        //选择了ssh
        let _this = this;
        let ssh = this.getSSH();
        if (ssh === null) {
            return;
        }
        let values = {
            ip: ssh.ip,
            port: ssh.port,
            username: ssh.username,
            password: ssh.password,
            name: ssh.name,
            path: path
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(function (res) {
            res.json().then(function (data) {
                // console.log(data);
                let list = [];
                let res = data.data;
                // console.log(res);
                let length = res.length;
                for (let i = 0; i < length; i++) {
                    const one = data.data[i];
                    let obj = {
                        title: one.filename,
                        key: one.filename,
                        isLeaf: one.longname[0] !== 'd'
                    };
                    list.push(obj);
                }
                _this.setState({
                    treeData: list
                })
            });
        });

    };

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} dataRef={item}/>;
        });
    };

    onSelect = (selectedKeys, info) => {
        // console.log('selected', selectedKeys, info);
        this.setState({
            path: "/" + selectedKeys[0]
        });
    };

    //=================

    //添加配置
    showAddSource = (sourceType) => {
        this.setState({
            show: true,
            sourceType: sourceType
        })
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
        if (!formData.sshId || formData.sshId === "") {
            message.warn("请选择SSH", 3);
            return;
        }
        let values = {
            selectType: 1,
            info: {
                name: formData.name,
                path: formData.path,
                tags: formData.tags,
                rule: formData.rule

            },
            groupId: formData.groupId,
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
        const {currentConfig = {}} = props;
        this.setState({
            ...currentConfig.info,
            sshId: currentConfig.sshId,
            sshIP: currentConfig.sshIP,
            groupId: currentConfig.groupId
        })
    }

    componentDidMount() {
        this.getSSHDropdown();
        this.getGroupDropdown();
    }

    render() {
        const {sshDropdown, groupDropdown} = this.state;

        return (
            <div>
                <div>
                    <Card
                        title="配置SSH"
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
                                            placeholder="选择SSH"
                                            value={this.state.sshId}
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
                </div>
                <div style={{marginTop: 15}}>
                    <Card
                        title="日志信息"
                        bordered={false}
                        bodyStyle={{
                            backgroundColor: "#343842",
                            color: "#888",
                            cursor: "pointer",
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
                                        <Tooltip title={this.state.path} placement="top">
                                            <Input

                                                id="path"
                                                addonBefore="文件路径"
                                                addonAfter={<Icon type="folder-open" onClick={this.showModal}/> }
                                                value={this.state.path}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'path')}
                                            /></Tooltip>
                                    </FormItem>

                                </Col>
                            </Row>

                            <Modal
                                title="选择日志文件"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <Tree
                                    loadData={this.onLoadData}
                                    onSelect={this.onSelect}
                                >
                                    {this.renderTreeNodes(this.state.treeData)}
                                </Tree>
                            </Modal>

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

                            <div style={{margin: 20, textAlign: "center"}}>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    icon="save"
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
                        this.getSSHDropdown();
                        this.setState({show: false})
                    }}/>
            </div>
        );
    }
}

export default connect((state) => ({
    currentConfig: state.currentConfig
}))(SSH);