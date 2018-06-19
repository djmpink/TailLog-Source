/* eslint-disable no-restricted-globals */
import React from "react";
import {connect} from "react-redux";
import "./logs.scss";
import "./xterm.css";
import "./fullscreen.css";
import {Link} from "react-router";
import AjaxAction from "../../actions/AjaxAction";
import actions from "../../actions";
import {Button, Cascader, Col, Icon, Layout, message, Row, Switch, Tooltip} from "antd";
import Setting from "../../components/Setting";
import CopyRight from "../../components/CopyRight";
import Terminal from "xterm";

const {Header, Content} = Layout;

Terminal.loadAddon('fit');  // Load the `fit` addon
Terminal.loadAddon('attach');  // Load the `fit` addon
Terminal.loadAddon('fullscreen');  // Load the `fullscreen` addon

let term;
let socket;
let isConnected = false;

//终端工具
class Term extends React.Component {
    constructor() {
        super();
        this.state = {
            contentHeight: 0,
            data: [],
            text: '选择SSH',
            cmd: '',
            loading: false,
            options: [],
            disabled: true,
            checked: false
        }
    };

    //获取配置下拉列表
    getDropDown = () => {
        const {dispatch} = this.props;
        dispatch(AjaxAction.configSSHDropDown());
    };
    //组装配置下来列表结构
    handleDropDown = (data) => {

        if (!data || !data.length) {
            return [];
        }
        let result = [];
        data.map(({ip, name, id, username}, index) => {
            let obj = {
                label: username + " @ " + ip + "「" + name + "」",
                value: id,
                isLeaf: true
            };
            result.push(obj);

            return result;
        });
        this.setState({
            options: result
        })
    };

    componentWillReceiveProps(props) {
        this.handleDropDown(props.sshDropdown);
        let ssh = props.currentSSH;
        if (ssh.id === undefined || typeof ssh !== 'object') {
            this.setState({
                text: "选择SSH",
                disabled: true,
                checked: false
            });
        } else {
            this.setState({
                text: ssh.username + " @ " + ssh.ip + "「" + ssh.name + "」",
                disabled: false,
                checked: false
            });
        }
    }

    //服务器-日志文件-级联选择
    selected = "";
    onChange = (value, selectedOptions) => {
        this.closeConn();

        this.selected = value[0];
        this.setState({
            text: selectedOptions[0].label,
            disabled: false
        }, () => {
            let {dispatch} = this.props;
            dispatch(AjaxAction.configSSHDetail(this.selected)).then((data) => {
                if (data.result) {
                    dispatch(actions.fillCurrentSSH(data.data));
                    this.initConnect();
                } else {
                    message.error(data.msg);
                }
            }).catch(() => {

            });
        });
    };

    //tail 开关
    switchConn = (e) => {
        let {currentSSH = {}} = this.props;

        if (e) {
            if (typeof currentSSH !== 'object') {
                message.warn("未选择日志/配置信息有误");
            } else {
                this.initConnect();
            }
        } else {
            this.closeConn();
        }
    };

    //清空当前日志
    clear = () => {
        term.clear();
    };

    closeConn = () => {
        console.log("closeConn");
        if (isConnected) {
            console.log("socket.close");
            socket.close();
            isConnected = false;
        }

        if (term !== undefined) {
            console.log("term.destroy");
            term.destroy();
            term._initialized = false;
        }

        this.setState({
            checked: false
        })
    };

    initTermConn = () => {
        console.log("initTermConn");
        term.attach(socket, true, true);
        term.focus();
        this.setState({
            checked: true
        })
    };

    initWebSocket = () => {
        console.log("initWebSocket");
        if (!isConnected) {
            console.log("initWebSocket init");
            let _this = this;
            socket = new WebSocket("ws://127.0.0.1:10779/websocket");
            socket.onopen = function () {
                isConnected = true;
                _this.initTermConn();
            };
            socket.onclose = function () {
                isConnected = false;
                _this.closeConn();
            };
            socket.onerror = function () {
                isConnected = false;
                _this.closeConn();
            };
        }
    };

    initTermView = () => {
        console.log("initTermView");
        const terminalContainer = document.getElementById('terminal-container');
        while (terminalContainer.children.length) {
            terminalContainer.removeChild(terminalContainer.children[0]);
        }
        if (term === undefined || !term._initialized) {
            term = new Terminal({
                cursorBlink: true,
            });
            term._initialized = true;
        }
        term.open(terminalContainer);
        term.fit();
    };

    initConnect = () => {
        console.log("initConnect");
        let {currentSSH = {}} = this.props;
        let _this = this;
        this.initTermView();
        fetch('http://127.0.0.1:10778/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...currentSSH, cols: term.cols, rows: term.rows})
        }).then(function (res) {
            res.text().then(function (data) {
                _this.initWebSocket();
            });
        });
    };

    componentDidMount() {
        this.setState({
            contentHeight: document.documentElement.clientHeight - 130//50+50+30
        });
        window.addEventListener("resize", () => {
            this.setState({
                contentHeight: document.documentElement.clientHeight - 130
            });
            term.fit();
        });
        this.getDropDown();
        this.initTermView();
        if (isConnected){
            this.setState({
                checked: true
            });
        }
    }

    render() {
        return (
            <Layout className={'layout'}>
                <Header className={'layout-header'}>
                    <Row>
                        <Col span={1}>
                            <Link to="config">
                                <Icon type="appstore-o" style={{fontSize: 16}}/>
                                {/*<Button  shape="circle" icon="home" />*/}
                            </Link>
                        </Col>
                        <Col span={12}>
                            <Cascader
                                style={{
                                    width: 300,
                                    textAlign: 'center'
                                }}
                                options={this.state.options}
                                // loadData={this.loadData}
                                expandTrigger="hover"
                                onChange={this.onChange}
                            >
                            <span style={{color: '#ccc', fontSize: 14, cursor: "pointer"}}>{this.state.text}
                                <a>
                                    <Icon type="down" style={{
                                        paddingLeft: 10,
                                        color: '#ccc'
                                    }}/>
                                </a>
                            </span>
                            </Cascader>
                        </Col>
                        <Col span={6}/>
                        <Col span={2}>
                            <Tooltip title="断开/连接" overlayStyle={{opacity: 0.7}}>
                                <Switch defaultChecked={false} checkedChildren="连接" unCheckedChildren="断开"
                                        checked={this.state.checked}
                                        disabled={this.state.disabled}
                                        onChange={this.switchConn }/>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Col span={6}>
                                <Tooltip title="清空" overlayStyle={{opacity: 0.7}}>
                                    <Button type="primary" size="small" shape="circle" icon="retweet"
                                            onClick={this.clear}/>
                                </Tooltip>
                            </Col>
                            <Col span={6}>
                                <Link to="config">
                                    <Tooltip title="新增配置" overlayStyle={{opacity: 0.7}}>
                                        <Button type="primary" size="small" shape="circle" icon="plus-circle-o"/>
                                    </Tooltip>
                                </Link>
                            </Col>
                            <Col span={6}>
                                {/*<Tooltip title="下载日志" overlayStyle={{opacity: 0.7}}>*/}
                                    {/*<a href="http://logger.taillog.cn" target="_blank" rel="noopener noreferrer">v1.0.0</a>*/}
                                {/*</Tooltip>*/}
                            </Col>
                            <Col span={6}>
                                <Setting {...this.props}/>
                            </Col>

                        </Col>
                    </Row>
                </Header>
                <Content style={{
                    marginTop: 50,
                    display: 'flex',
                    marginBottom: 20,
                    height: this.state.contentHeight,
                }}>
                    <div id="terminal-container" className="terminal">

                    </div>
                </Content>

                <CopyRight/>
            </Layout>

        )
    }
}
export default connect((state) => ({
    dropdown: state.dropdown,
    currentDropdown: state.currentDropdown,
    currentConfig: state.currentConfig,
    currentSSH: state.currentSSH,
    sshDropdown: state.sshDropdown
}))(Term)


