import React from "react";
import {connect} from "react-redux";
import {Button, Card, Col, Layout, Row} from "antd";
import AjaxAction from "../../actions/AjaxAction";
import "../Login/index.scss";
import Header from "../../components/Header/Header2";
import {withRouter} from "react-router";

//注册激活页
class Activate extends React.Component {

    componentDidMount() {
        let {dispatch, router} = this.props;
        let {email, ticket} = this.props.location.query;
        dispatch(AjaxAction.activate(email, ticket)).then((data) => {
            if (data.result) {
                setTimeout(() => {
                    router.push('/login');
                }, 3000)
            }
        });
    }

    render() {
        return (
            <Layout className={'layout'}>
                <Header />
                <div style={{margin: "auto"}}>
                    <Card className={'login-div'}>

                        <h1>注册成功，马上体验</h1>
                        <Row>
                            <Col span={8}/>
                            <Col span={8}>
                                <Button type="primary" style={{width: "100%"}} onClick={()=>{this.props.history.push('/login')}}>登录</Button>
                            </Col>
                            <Col span={8}/>
                        </Row>
                    </Card>
                </div>
            </Layout>

        )

    }
}
;
export default connect((state) => ({state: state}))((withRouter(Activate)));