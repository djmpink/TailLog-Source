import React, {Component} from "react";
import {connect} from "react-redux";
import {Breadcrumb, Button, Col, Icon, Row, Tabs} from "antd";
import Right from "../Right";
import AgentSource from "./Agent";
import SShSource from "./SSH";
import GroupSrurce from "./Group";
import "./index.scss";

const TabPane = Tabs.TabPane;


class Source extends Component {

    renderHeader = (id, sourceType, breadcrumb) => {
        let title="未知";
        switch (sourceType) {
            case 1:
                title="SSH";
                break;
            case 2:
                title="代理";
                break;
            case 5:
                title="分组";
                break;
            default:
                return;
        }
        return (
            <div>
                <Row>
                    <Col span={23}>
                        <Breadcrumb separator={<Icon type="caret-right"/>}>
                            <Breadcrumb.Item onClick={this.close} style={{cursor: "pointer",}}>
                                <Icon type="home" style={{color: '#aaa'}}/>
                                <span style={{color: '#aaa'}}>日志管理</span>
                            </Breadcrumb.Item>
                            {
                                breadcrumb === 3 ?
                                    <Breadcrumb.Item onClick={this.close} style={{cursor: "pointer",}}>
                                        <Icon type="edit" style={{color: '#aaa'}}/>
                                        <span style={{color: '#aaa'}}>日志配置</span>
                                    </Breadcrumb.Item> : null
                            }
                            <Breadcrumb.Item>
                                <Icon type={id ? "edit" : "plus"} style={{color: '#aaa'}}/>
                                <span style={{color: '#aaa'}}>{id ? "编辑" + title : "新建" + title}</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col span={1}>
                        <Button
                            shape="circle" icon="close"
                            type="primary"
                            ghost
                            onClick={this.close}/>

                    </Col>
                </Row>
            </div>
        )
    };

    close = () => {
        this.props.closeSource && this.props.closeSource();
    };

    closeCallback = () => {
        this.close();
    };

    render() {
        let {show, sourceType, breadcrumb,id} = this.props;
        return (
            <Right show={show} close={this.close} header={this.renderHeader(id, sourceType, breadcrumb)}>
                <div className="card-container" style={{marginLeft: 50, marginTop: 0}}>
                    <Tabs tabPosition="left" type="card" defaultActiveKey={"1"}>
                        {

                            sourceType === 1 ?
                                <TabPane
                                    disabled
                                    tab={<span>SSH</span>}
                                    key="1">
                                    <SShSource closeCallback={this.closeCallback}/>
                                </TabPane>
                                :
                                sourceType===2?
                                    <TabPane
                                        disabled
                                        tab={<span>代理</span>}
                                        key="1">
                                        <AgentSource closeCallback={this.closeCallback}/>
                                    </TabPane>
                                    :
                                    <TabPane
                                        disabled
                                        tab={<span>分组</span>}
                                        key="1">
                                        <GroupSrurce closeCallback={this.closeCallback}/>
                                    </TabPane>
                        }
                    </Tabs>
                </div>
            </Right>
        );
    }
}

export default connect((state) => ({}))((Source));