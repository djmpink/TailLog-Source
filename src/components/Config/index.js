import React, {Component} from "react";
import {connect} from "react-redux";
import {Breadcrumb, Button, Col, Icon, Row, Tabs} from "antd";
import Right from "../Right";
import Shell from "./SSH";
import Agent from "./Agent";
import File from "./File";

import "./index.scss";

import actions from "../../actions";
const TabPane = Tabs.TabPane;


class Detail extends Component {


    renderHeader = (id) => {
        return (
            <div>
                <Row>
                    <Col span={23}>
                        <Breadcrumb separator={<Icon type="caret-right"/>}>
                            <Breadcrumb.Item onClick={this.close} style={{cursor: "pointer",}}>
                                <Icon type="home" style={{color: '#aaa'}}/>
                                <span style={{color: '#aaa'}}>日志管理</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Icon type={id ? "edit" : "plus"} style={{color: '#aaa'}}/>
                                <span style={{color: '#aaa'}}>{id ? "编辑配置" : "新建配置"}</span>
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
        const {dispatch} = this.props;
        dispatch(actions.showConfigRight(false));
        dispatch(actions.removeCurrentConfig());
    };

    closeCallback = () => {
        this.close();
        this.props.addCallback && this.props.addCallback();
    };

    render() {
        let {currentConfig = {}, show} = this.props;

        let id = !currentConfig ? 0 : currentConfig.id;

        let props = {};
        !currentConfig ? props.activeKey = "2" : currentConfig.selectType && (props.activeKey = '' + currentConfig.selectType);

        return (
            <Right show={show} close={this.close} header={this.renderHeader(id)}>
                <div className="card-container" style={{marginLeft: 50, marginTop: 0}}>
                    <Tabs tabPosition="left" type="card" defaultActiveKey={"1"} {...props}>
                        <TabPane
                            // disabled
                            tab={<span>SSH</span>}
                            key="1">
                            <Shell closeCallback={this.closeCallback}/>
                        </TabPane>
                        <TabPane
                            tab={<span>代理</span>}
                            key="2">
                            <Agent closeCallback={this.closeCallback}/>
                        </TabPane>
                        <TabPane
                            // disabled
                            tab={<span>文件</span>}
                            key="3">
                            <File closeCallback={this.closeCallback}/>
                        </TabPane>
                    </Tabs>
                </div>
            </Right>
        );
    }
}

export default connect((state) => ({
    show: state.ui.showConfigRight,
    currentConfig: state.currentConfig
}))((Detail));