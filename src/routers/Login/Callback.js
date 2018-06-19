import React from "react";
import "./index.scss";
import AjaxAction from "../../actions/AjaxAction";
import {connect} from "react-redux";
import {Card, Layout} from "antd";
import Header from "../../components/Header/Header2";

//登录成功页面
class Callback extends React.Component {

    componentDidMount() {
        let {dispatch} = this.props;
        let platform = this.props.params.platform;
        let {code} = this.props.location.query;
        let {router} = this.props;
        dispatch(AjaxAction.oauth2Callback(platform, code)).then((data) => {
            if (data.result) {
                router.push('/config');
            }
        });
    }

    render() {
        return (
            <Layout className={'layout'}>
                <Header />
                <div style={{margin: "auto"}}>
                    <Card style={{boxShadow: "none"}} className="login-div">
                        <h1>登录成功</h1>
                    </Card>
                </div>
            </Layout>
        )
    }
}
export default connect((state) => {
    return {
        user: state.user
    }
})((Callback));