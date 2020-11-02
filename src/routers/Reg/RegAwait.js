import React from "react";
import {connect} from "react-redux";
import {Button, Card, Col, Layout, Row} from "antd";
import "../Login/index.scss";
import Header from "../../components/Header/Header2";
import {withRouter} from "react-router";

//等待注册激活页
class RegAwait extends React.Component {
    login = () => {
        let {history} = this.props;
        history.push('/login');
    };

    render() {
        return (
            <Layout className={'layout'}>
                <Header />
                <div style={{margin: "auto"}}>
                    <Card className={'login-div'}>
                        <h1>已发送注册邮件，请点击邮件链接激活</h1>
                        <Row>
                            <Col span={8}/>
                            <Col span={8}>
                                <Button type="primary" style={{width: "100%"}} onClick={this.login}>已激活，去登录</Button>
                            </Col>
                            <Col span={8}/>
                        </Row>
                    </Card>
                </div>
            </Layout>
        )

    }
}

export default connect()(withRouter(RegAwait));