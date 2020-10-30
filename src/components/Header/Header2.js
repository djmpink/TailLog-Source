import React from "react";
import {connect} from "react-redux";
import {Col, Layout, Row,Badge,Tooltip,Button} from "antd";
import "./index.scss";
import {withRouter} from "react-router";
const {Header} = Layout;


class Header2 extends React.Component {
    offLine = () => {
        this.props.history.push("/config");
    };
    render() {

        return (
            <Header className={'layout-header'}>
                <Row>
                    <Col span={1}>
                        <img src={require("../../images/logo-no-circle.png")}
                             alt="T"
                             style={{
                                 height: 27,
                                 margin: "auto",
                                 marginLeft: -10,
                                 marginTop: 12,
                                 background: "#fff",
                                 borderRadius: "50%"
                             }}
                        />
                    </Col>
                    <Col span={1}>
                        <span
                            style={{
                                color: "#fff",
                                fontSize: 15
                            }}>
                            TailLog
                        </span>
                    </Col>
                    <Col span={18}/>
                    <Col span={4} >
                        <Badge status="processing" className={'login-badge'}
                               text={
                                   <Tooltip title="免登陆，数据本地存储">
                                       <Button style={{color: "#ffbf00", border: 0,fontSize: 12}} ghost
                                               onClick={this.offLine}>本地使用</Button>
                                   </Tooltip>
                               }/>
                    </Col>
                </Row>
            </Header>
        )
    }
}

export default connect()(withRouter(Header2));
