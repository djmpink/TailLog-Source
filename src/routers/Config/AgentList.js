import React from "react";
import {connect} from "react-redux";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    GithubOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Layout, message, Popconfirm, Row, Table, Tooltip } from "antd";
import {listParams} from "../../defaultData";
import AjaxAction from "../../actions/AjaxAction";
import actions from "../../actions";
import "./index.scss";
import Source from "../../components/Source";
import Header from "../../components/Header";
import CopyRight from "../../components/CopyRight";

const {Content} = Layout;

//代理管理页
class AgentList extends React.Component {

    state = {
        id: null,
        show: false,
        collapsed: true,
        loading: true,
        contentHeight: 0,
        pagination: {...listParams},
    };

    columns = [
        {
            title: '服务器名称',
            dataIndex: 'name',
        }, {
            title: 'IP',
            dataIndex: 'ip',
        }, {
            title: '端口',
            dataIndex: 'port',
        }, {
            title: "操作",
            dataIndex: "id",
            render: (id, record) =>
                <div className="operations">
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

    //查看配置详情
    showConfig = (id, record) => {
        let {dispatch} = this.props;
        dispatch(AjaxAction.configAgentDetail(id)).then((data) => {
            if (data.result) {
                this.showAddSource(2, id);
                dispatch(actions.fillCurrentAgent(data.data));
            } else {
                message.error(data.msg);
            }
        }).catch(() => {

        });
    };

    //添加配置
    showAddSource = (sourceType, id) => {
        this.setState({
            id: id,
            show: true,
            sourceType: sourceType
        });
    };

    //删除
    remove = (id) => {
        let {dispatch} = this.props;
        dispatch(AjaxAction.configAgentRemove(id));
        this.getList(this.state.pagination);
    };

    close = (pagination, filters, sorter) => {
        const {dispatch} = this.props;
        dispatch(actions.removeCurrentAgent());
        this.setState({
            show: false,
            id: null
        });
        this.getList(pagination, filters, sorter);
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

    //获取配置列表
    getList = (page, filters, sorter) => {
        let {dispatch} = this.props;
        let pagination = Object.assign({}, this.state.pagination, page);
        this.setState({
            pagination: pagination
        }, () => {
            let params = {
                ...this.state.pagination,
                ...filters
            };

            dispatch(AjaxAction.configAgentList(params)).then((data) => {
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
    }

    render() {
        return (
            <Layout className={'layout'}>
                <Header breadcrumb={2} {...this.props}/>

                <Content
                    className={'layout-content'}
                    style={{
                        margin: '50px 20px 50px',
                        padding: 24,
                        background: '#292C34',
                        minHeight: 200,
                        borderRadius: '5px'
                    }}>
                    <div className="list-publish config-list" style={{
                        paddingLeft: 0,
                        overflowY: 'auto',
                        height: this.state.contentHeight
                    }}>
                        <div>
                            <Row>
                                <Col span={2}>
                                    <Tooltip title="新增代理配置" placement="right">
                                        <Button
                                            type="primary"
                                            onClick={this.showAddSource.bind(this, 2, null)}
                                            shape="circle"
                                            icon={<PlusOutlined />}
                                            style={{marginRight: 10}}/>
                                    </Tooltip>
                                </Col>
                                <Col span={19}/>
                                <Col span={1} style={{marginTop: 5, float: "right"}}>
                                    <Tooltip title="说明文档，示例程序" placement="left">
                                        <a href="https://github.com/djmpink/TailLog-Agent" target="_blank"
                                           rel="noopener noreferrer">
                                            <GithubOutlined style={{color: "#00a854"}} />
                                        </a>
                                    </Tooltip>
                                </Col>
                                <Col span={1} style={{marginTop: 5, float: "right"}}>
                                    <Tooltip title="配置代理信息，「日志管理」中可以通过单独部署的代理程序访问日志" placement="left">
                                        <ExclamationCircleOutlined style={{color: "#ffbf00"}} />
                                    </Tooltip>
                                </Col>
                                <Col span={1}/>
                            </Row>
                        </div>

                        <div style={{marginTop: 20}}>
                            <Table
                                className="config-table"
                                rowKey="id"
                                size="middle"
                                loading={this.state.loading}
                                columns={this.columns}
                                dataSource={this.props.agentList}
                                pagination={this.state.pagination}
                                onChange={this.handleTableChange}
                                onRowDoubleClick={this.monitorLog}
                            />
                        </div>
                        {
                            this.props.agentList.length < 5 ?
                                < div style={{display: "flex", justifyContent: "center", marginTop: 10}}>
                                    <div className={'config-list-back-image2'}/>
                                </div> : null
                        }

                    </div>
                </Content>

                <CopyRight/>
                <Source
                    id={this.state.id}
                    show={this.state.show}
                    sourceType={this.state.sourceType}
                    breadcrumb={2}
                    closeSource={this.close}/>
            </Layout>
        );
    }
}
export default connect((state) => ({
    agentList: state.agentList,
}))(AgentList);