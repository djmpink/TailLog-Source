import React from "react";
import {connect} from "react-redux";
import {
    CloseCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    PlusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import {
    Button,
    Col,
    Input,
    Layout,
    message,
    Popconfirm,
    Row,
    Select,
    Table,
    Tooltip,
} from "antd";
import {listParams} from "../../defaultData";
import AjaxAction from "../../actions/AjaxAction";
import actions from "../../actions";
import "./index.scss";

import Detail from "../../components/Config";
import Header from "../../components/Header";
import CopyRight from "../../components/CopyRight";
const Option = Select.Option;
const {Content} = Layout;
const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

//日志配置列表页
class Config extends React.Component {

    state = {
        filters: [],
        collapsed: true,
        loading: true,
        contentHeight: 0,
        search: null,
        pagination: {...listParams}
    };


    doubleClick = (record) => {
        this.monitorLog(record.id);
    };

    //查看日志详情
    monitorLog = (id) => {
        let {dispatch} = this.props;
        dispatch(AjaxAction.configDetail(id)).then((data) => {
            if (data.result) {
                dispatch(actions.fillCurrentConfig(data.data))
                this.props.router.push("/multi")

            } else {
                message.error(data.msg);
            }
        }).catch((e) => {
            console.warn(e);
        });

    };

    //查看配置详情
    terminal = (id, record) => {
        if (record.type === "SHELL") {
            let {dispatch} = this.props;
            dispatch(AjaxAction.configSSHDetail(record.sshId)).then((data) => {
                if (data.result) {
                    dispatch(actions.fillCurrentSSH(data.data));
                    this.props.router.push("/term");
                } else {
                    message.error(data.msg);
                }
            }).catch(() => {

            });
        } else {
            message.info("SSH配置才可以开启终端模式");
        }
    };

    //查看配置详情
    showConfig = (id, record) => {
        let {dispatch} = this.props;

        dispatch(AjaxAction.configDetail(id)).then((data) => {
            if (data.result) {
                this.showAddConfig(true);
                dispatch(actions.fillCurrentConfig(data.data));
            } else {
                message.error(data.msg);
            }
        }).catch(() => {

        });
    };

    //添加配置
    showAddConfig = () => {
        const {dispatch} = this.props;
        dispatch(actions.showConfigRight(true));
    };

    //删除
    remove = (id) => {
        let {dispatch} = this.props;
        dispatch(AjaxAction.configRemove(id));
        this.getList(this.state.pagination);
    };

    //表格刷新
    handleTableChange = (pagination, filters, sorter) => {
        this.getList(pagination, filters, sorter);
    };

    //loading
    setLoading = (flag) => {
        this.setState({
            loading: flag
        })
    };

    onChangeSearch = (e) => {
        this.setState({search: e.target.value});
    };


    //清空命令行
    emitEmpty = () => {
        this.searchInput.focus();
        this.setState({search: null});
        this.getList();
    };

    //执行搜索
    onProcessSearch = () => {
        this.setLoading(true);
        this.getList();
    };


    handleChange = (value) => {
        console.log(`selected ${value}`);
    };

    //获取配置列表
    getList = (page, filters, sorter) => {
        let {dispatch} = this.props;
        let pagination = Object.assign({}, this.state.pagination, page);
        this.setState({
            pagination: pagination
        }, () => {
            let params = {
                ...this.state.pagination,
                searchVal: this.state.search,
                ...filters
            };
            dispatch(AjaxAction.configList(params)).then((data) => {
                let {total} = data.data;
                this.setState({
                    pagination: {
                        ...this.state.pagination,
                        total
                    }
                });
                this.setLoading(false);
            }).catch(() => {
                this.setLoading(false);
            });
        })
    };
    getGroupDropdown = () => {
        const {dispatch} = this.props;
        dispatch(AjaxAction.configGroupDropDown()).then((data) => {
            this.getFilters(data.data);
        }).catch(() => {
        });
    };
    getFilters = (data) => {
        let list = [{
            text: "无",
            value: "-1",
        }];
        data.map((one, index) => {
            let obj = {
                text: one.name,
                value: one.id,
            };
            list.push(obj);
            return list;
        });

        this.setState({
            filters: list
        });
    };

    componentDidMount() {
        this.setState({
            contentHeight: document.documentElement.clientHeight - 130//50+50+30
        });
        window.addEventListener("resize", () => {
            this.setState({
                contentHeight: document.documentElement.clientHeight - 130
            })
        });
        this.getList();
        this.getGroupDropdown();
    }

    render() {

        const columns = [
            {
                title: '日志名称',
                dataIndex: 'name',
            }, {
                title: '服务器名称',
                dataIndex: 'ipName',
            }, {
                title: '服务器IP',
                dataIndex: 'ip',
            }, {
                title: '监控方式',
                dataIndex: 'type',
                filters: [{
                    text: 'SSH',
                    value: 1,
                }, {
                    text: '代理',
                    value: 2,
                }, {
                    text: '文件',
                    value: 3,
                }],
                render: text => {
                    switch (text) {
                        case "SHELL":
                            return <span style={{color: "#9199ac"}}>SSH</span>;
                        case "AGENT":
                            return <span style={{color: "#9199ac"}}>代理</span>;
                        case "FILE":
                            return <span style={{color: "#9199ac"}}>文件</span>;
                        default:
                            return <span style={{color: "#9199ac"}}>{text}</span>;

                    }
                }
            }, {
                title: '分组',
                dataIndex: 'groupName',
                filters: this.state.filters,
            }, {
                title: '日志路径',
                dataIndex: 'path',
                render: text => {
                    return text === null || text === "" ? "" : text.substring(text.lastIndexOf("/") + 1);
                }
            }, {
                title: "操作",
                dataIndex: "id",
                render: (id, record) =>
                    <div className="operations">
                        <Tooltip title="监控">
                            <Button type="primary" onClick={this.monitorLog.bind(this, id, record)} shape="circle"
                                    icon={<EyeOutlined />}
                                    style={{marginRight: 10, borderColor: "rgba(114, 137, 218, 0.2)"}} ghost/>
                        </Tooltip>
                        {/*<Tooltip title="命令行">*/}
                            {/*<Button type="primary" onClick={this.terminal.bind(this, id, record)} shape="circle"*/}
                                {/*// icon={<i className="fa fa-terminal"*/}
                                {/*//          style={{fontSize: 16, color: '#888'}}/>}*/}
                                    {/*style={{marginRight: 10, borderColor: "rgba(114, 137, 218, 0.2)"}} ghost>*/}
                                {/*<i className="fa fa-code" style={{fontSize: 16}}/>*/}
                            {/*</Button>*/}
                        {/*</Tooltip>*/}
                        <Tooltip title="编辑">
                            <Button type="primary" onClick={this.showConfig.bind(this, id, record)} shape="circle"
                                    icon={<EditOutlined />}
                                    style={{marginRight: 10, borderColor: "rgba(114, 137, 218, 0.2)"}} ghost/>
                        </Tooltip>
                        <Popconfirm title="删除该配置?" overlayStyle={{background: "#292C34"}}
                                    onConfirm={this.remove.bind(this, id)}>
                            <Tooltip title="删除">
                                <Button type="primary" shape="circle" icon={<DeleteOutlined />}
                                        style={{marginRight: 10, borderColor: "rgba(114, 137, 218, 0.2)"}} ghost/>
                            </Tooltip>
                        </Popconfirm>
                    </div>
            }];


        const commandInputSuffix = this.state.search ?
            <CloseCircleOutlined style={{color: '#888'}} onClick={this.emitEmpty} /> : null;

        return (
            <Layout className={'layout'}>
                <Header breadcrumb={0} {...this.props}/>
                <Content
                    className={'layout-content'}
                    style={{
                        margin: '50px 20px 50px',
                        padding: 24,
                        background: '#292C34',
                        minHeight: 200,
                        borderRadius: "5px"
                    }}
                >
                    <div className="list-publish config-list" style={{
                        paddingLeft: 0,
                        overflowY: 'auto',
                        height: this.state.contentHeight
                    }}>
                        <div>
                            <Row style={{padding: 2}}>
                                <Col span={2}>
                                    <Tooltip title="新增日志配置" placement="right">
                                        <Button
                                            type="primary"
                                            onClick={this.showAddConfig}
                                            shape="circle"
                                            icon={<PlusOutlined />}
                                            style={{marginRight: 10}}/>
                                    </Tooltip>
                                </Col>
                                <Col span={18}/>
                                <Col span={4}>
                                    <Input className={'search'}
                                        // placeholder="搜索"
                                           prefix={<SearchOutlined style={{color: '#7187d7', marginLeft: 5}} />}
                                           suffix={commandInputSuffix}
                                           value={this.state.search}
                                           onChange={this.onChangeSearch}
                                           onPressEnter={this.onProcessSearch}
                                           ref={node => this.searchInput = node}
                                    />
                                </Col>
                            </Row>
                        </div>

                        <div style={{marginTop: 20}}>
                            <Table
                                className="config-table"
                                rowKey="id"
                                size="middle"
                                loading={this.state.loading}
                                columns={columns}
                                dataSource={this.props.configList}
                                pagination={this.state.pagination}
                                onChange={this.handleTableChange}
                                onRowDoubleClick={this.doubleClick}
                                expandedRowRender={record => <p>{"日志文件全路径： " + record.path}</p>}
                            />
                        </div>
                        {
                            this.props.configList.length < 5 ?
                                < div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <div className={'config-list-back-image'}/>
                                </div> : null
                        }

                    </div>
                </Content>

                <CopyRight/>
                <Detail addCallback={this.getList}/>
            </Layout>
        );
    }
}
export default connect((state) => ({
    configList: state.configList,
}))(Config);