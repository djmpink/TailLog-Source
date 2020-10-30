import React from "react";
import {connect} from "react-redux";
import {
    CheckCircleOutlined,
    LeftOutlined,
    LockOutlined,
    MailOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Layout, notification, Row } from "antd";
import AjaxAction from "../../actions/AjaxAction";
import "../Login/index.scss";
import {Link} from "react-router-dom";

const {Header} = Layout;

const fontStyle = {
    fontSize: 14,
    color: "#aaa",
};
class UserSetting extends React.Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ...props.userSetting,
            nicknameEdit: false,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            ...props.userSetting,
        })
    }

    componentDidMount() {
        let {dispatch} = this.props;
        dispatch(AjaxAction.userSettingInfo());
    }


    openNotification = () => {
        notification.open({
            message: <p style={{color: '#94a5e3'}}>昵称修改成功 !</p>,
            icon: <CheckCircleOutlined style={{color: '#009e4a'}} />,
            duration: 2,
            style: {
                width: 300,
                background: "rgba(163, 172, 206, 0.35)",
                color: "#ccc",
                marginTop: 0,
                marginLeft: -200,
            },
        });

    };

    changeNickname = () => {
        this.setState({
            nicknameEdit: true,
        })
    };

    finishNickname = () => {
        let {dispatch, userSetting} = this.props;
        this.setState({
            nicknameEdit: false
        }, () => {
            let {nickname} = this.state;
            if (userSetting.nickname === nickname || nickname === "") {
                return;
            }
            dispatch(AjaxAction.userSettingInfoEdit({nickname})).then((data) => {
                if (data.result) {
                    this.openNotification();
                }
            });
        });
    };
    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    render() {
        return (
            <Layout className={'layout'}>
                <Header className={'layout-header'}>
                    <Button
                        shape="circle" icon={<LeftOutlined />}
                        type="primary"
                        onClick={() => {
                            let {router} = this.props;
                            router.push('/config');
                        }}/>
                </Header>
                <div style={{margin: "auto"}}>
                    <Card className={'login-div'}>
                        <h1>帐&nbsp;&nbsp;号&nbsp;&nbsp;设&nbsp;&nbsp;置</h1>

                        <Row style={{marginTop: 20}}>

                            <Col span={2}>
                                <UserOutlined style={{fontSize: 16, marginTop: 2, color: "#ccc"}} />
                            </Col>
                            <Col span={4}>
                                <p style={fontStyle}>昵称:</p>
                            </Col>
                            <Col span={10}>
                                {this.state.nicknameEdit ?
                                    <Input
                                        id="nickname"
                                        value={this.state.nickname}
                                        onChange={this.handleInputChange.bind(this, 'nickname')}
                                    />
                                    :
                                    <p style={fontStyle}>{this.state.nickname}</p>
                                }
                            </Col>
                            <Col span={2}/>
                            <Col span={6}>
                                {this.state.nicknameEdit ?
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        style={{fontSize: 14}}
                                        onClick={this.finishNickname}
                                        ghost
                                    >
                                        保 存
                                    </Button>
                                    :
                                    <a className="link" style={{fontSize: 14}} onClick={this.changeNickname}>修改</a>

                                }
                            </Col>

                        </Row>
                        <Row style={{marginTop: 20}}>
                            <Col span={2}>
                                <MailOutlined style={{fontSize: 16, marginTop: 2, color: "#ccc"}} />
                            </Col>
                            <Col span={4}>
                                <p style={fontStyle}>邮箱:</p>
                            </Col>
                            <Col span={10}>
                                <p style={fontStyle}>{this.state.email}</p>
                            </Col>
                            <Col span={2}/>
                            <Col span={6}>
                                <Link className="link" to="/binding" style={{fontSize: 14}}>修改</Link>
                            </Col>

                        </Row>
                        <Row style={{marginTop: 20}}>
                            <Col span={2}>
                                <LockOutlined style={{fontSize: 16, marginTop: 2, color: "#ccc"}} />
                            </Col>
                            <Col span={4}>
                                <p style={fontStyle}>密码:</p>
                            </Col>
                            <Col span={10}>
                                <p style={fontStyle}>********</p>
                            </Col>
                            <Col span={2}/>
                            <Col span={6}>
                                <Link className="link" to="/reset" style={{fontSize: 14}}>修改</Link>
                            </Col>

                        </Row>
                    </Card>
                </div>
            </Layout>
        );
    }
}
export default connect((state) => {
    return {
        userSetting: state.userSetting
    }
})((UserSetting));