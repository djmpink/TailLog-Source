import React from "react";
import {connect} from "react-redux";
import "./logs.scss";
import {Link, withRouter} from "react-router-dom";
import AjaxAction from "../../actions/AjaxAction";
import actions from "../../actions";

import {
    AppstoreOutlined,
    CloseCircleOutlined,
    DownloadOutlined,
    DownOutlined,
    LeftCircleOutlined,
    RetweetOutlined,
    RightCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';

import { Button, Cascader, Col, Input, Layout, message, Row, Spin, Switch, Tooltip } from "antd";
import Setting from "../../components/Setting";
const {Header, Content} = Layout;

//实时日志展示页
class Logs extends React.Component {
    constructor() {
        super();
        this.state = {
            contentHeight: 0,
            data: [],
            text: '选择日志文件',
            cmd: '',
            search: '',
            loading: false,
            options: [],
            disabled: true,
            checked: false,
            animateToRight: false,
        }
    };

    //服务器-日志文件-级联选择
    selected = "";
    onChange = (value, selectedOptions) => {

        this.selected = value[2];
        this.setState({
            text: selectedOptions.map(o => o.label).join(' · '),
            disabled: false
        }, () => {
            let {dispatch} = this.props;
            dispatch(AjaxAction.configDetail(this.selected)).then((data) => {
                if (data.result) {
                    this.props.setConfig(data.data);
                } else {
                    message.error(data.msg);
                }
            }).catch(() => {

            });
        });
    };

    //高亮关键词
    highLightWords(text, keywords) {
        let index = text.indexOf(keywords);
        if (index > -1) {//匹配成功
            return (
                <span style={{flex: 1}}>
                    {text.slice(0, index)}
                    <code style={{color: "#e73b55"}}>{keywords}</code>
                    {text.slice(index + keywords.length)}
                </span>
            )
        }
        return <span style={{flex: 1}}>{text}</span>;
    }

    //格式化日志
    formatOneResult(one, index) {
        let num = (Array(6).join('0') + index).slice(-6);
        return (
            <div key={index} style={{color: "#2BB669"}}>
                <pre style={{whiteSpace: "pre-wrap", tabSize: 7, display: "flex", flexWrap: "wrap"}}>
                    <span style={{color: '#999'}}>{num} </span>
                    {this.highLightWords(one, this.state.search)}
                </pre>
            </div>
        )
    }

    //清空命令行
    emitEmpty = () => {
        this.commandInput.focus();
        this.setState({cmd: ''});
    };

    onChangeCmd = (e) => {
        e.stopPropagation();
        this.setState({cmd: e.target.value});
    };
    onChangeSearch = (e) => {
        e.stopPropagation();
        this.setState({search: e.target.value});
    };

    webSocket = null;
    isConnected = false;
    onProcessCmd = () => {
        let {currentConfig = {}} = this.props;

        if (typeof currentConfig.info !== 'object') {
            message.warn("未选择日志/配置信息有误");
        } else {
            let path = currentConfig.info.path;
            let route = path.substring(0, path.lastIndexOf("/") + 1);
            this.setState({
                data: [],
                loading: true,
                checked: false
            }, () => {
                let params = {
                    order: "ssh",
                    ssh: {...currentConfig.ssh},
                    content: "cd " + route + " && " + this.state.cmd
                };
                this.setState({data: []});
                if (this.isConnected) {
                    this.isConnected = false;
                    this.webSocket.close(); //关闭TCP连接
                }
                this.sendSocket(params);
                setTimeout(() => {
                    this.setState({loading: false})
                }, 1000);
            });
        }
    };

    //执行搜索
    onProcessSearch = () => {
        let {currentConfig = {}} = this.props;
        //let _this = this;
        if (typeof currentConfig.info !== 'object') {
            message.warn("未选择日志/配置信息有误");
        } else {
            this.setState({
                data: [],
                loading: true,
                checked: false
            }, () => {
                let params = {
                    order: "ssh",
                    ssh: {...currentConfig.ssh},
                    content: "grep " + this.state.search + " " + currentConfig.info.path
                };
                this.setState({data: []});
                if (this.isConnected) {
                    this.isConnected = false;
                    this.webSocket.close(); //关闭TCP连接
                }
                this.sendSocket(params);
                setTimeout(() => {
                    this.setState({loading: false})
                }, 3000);
            });
        }
    };

    //清空当前日志
    clear = () => {
        this.setState({
            data: [],
        });
    };

    //tail 开关
    switchTail = (e) => {

        let {currentConfig = {}} = this.props;

        if (e) {
            if (typeof currentConfig.info !== 'object') {
                message.warn("未选择日志/配置信息有误");
            } else {
                let params = {
                    order: "ssh",
                    ssh: {...currentConfig.ssh},
                    content: "tail -f " + currentConfig.info.path
                };
                this.setState({
                    data: [],
                    checked: true
                });
                this.sendSocket(params);
            }
        } else {
            let _this = this;
            this.setState({
                checked: false
            });
            if (this.isConnected) {
                this.isConnected = false;
                _this.webSocket.close(); //关闭TCP连接
            }
        }
    };

    //查看terminal
    terminal = () => {
        let {currentConfig = {}, dispatch} = this.props;
        console.log(currentConfig)
        dispatch(AjaxAction.configDetail(currentConfig.id)).then((data) => {
            if (data.result) {
                dispatch(actions.fillCurrentConfig(data.data));
            } else {
                message.error(data.msg);
            }
        }).catch(() => {

        });
        this.props.history.push("/term");
    };

    //发送Webocket
    sendSocket = (params) => {
        let {currentConfig} = this.props;
        if (params === null) {
            params = {
                order: "ssh",
                ssh: {...currentConfig.ssh},
                content: "tail -f " + currentConfig.info.path
            };
        }
        let _this = this;
        if (!this.isConnected) {
            this.initSocket();
            this.webSocket.onopen = function () {
                console.log("建立连接");
                _this.isConnected = true;
                _this.sendSocket(params);
            };
        } else {
            this.webSocket.send(JSON.stringify(params));
        }
    };

    //初始化WebSocket连接
    initSocket = () => {
        let _this = this;
        let {currentConfig = {}} = this.props;
        //console.log("currentConfig:", currentConfig);
        //ws://121.40.214.161:9090/websocket
        let ws;
        switch (currentConfig.selectType) {
            case 1:
                ws = "127.0.0.1:10776";
                break;
            case 2:
                ws = currentConfig.agent.ip + ":" + currentConfig.agent.port;
                break;
            default:
        }

        this.webSocket = new WebSocket("ws://" + ws + "/websocket");

        this.webSocket.onmessage = function (event) {
            // 接收服务端的实时日志并添加到HTML页面中
            let data = "";
            data += event.data;

            let dataSplit = data.split('\n');
            const length = dataSplit.length;
            if (!dataSplit[length - 1]) {
                dataSplit = dataSplit.slice(0, length - 1);
            }
            _this.setState({
                data: _this.state.data.concat(dataSplit)
            });
            // 滚动条滚动到最低部
            // $(window).scrollTop($("body").height());
            const content = document.getElementById("content");
            if (content) {
                content.scrollTop = content.scrollHeight;
            }
        };
    };

    //获取配置下拉列表
    getDropDown = () => {
        const {dispatch} = this.props;
        return dispatch(AjaxAction.configDropDown());
    };


    //组装配置下来列表结构
    handleDropDown = (data) => {
        if (!data || !data.length) {
            return [];
        }
        let result = [];
        let map = [];//ip：ipName
        console.log(data);
        data.map(({ip, ipName, name, path, id}, index) => {
            let obj = {
                label: name,
                value: index,
                isLeaf: false,
                children: [{
                    value: id,
                    label: path ? path.substring(path.lastIndexOf("/") + 1) : ""
                }],
            };
            if (ip) {
                if (result[ip]) {
                    result[ip].push(obj)
                } else {
                    result[ip] = [obj];
                }

                if (!map[ip]) {
                    map[ip] = ipName;
                }
                return result;
            } else {
                return result;
            }


        });
        console.log(result);
        let list = [];
        for (let ip in result) {
            list.push({
                label: ip + "「" + map[ip] + "」",
                value: ip,
                children: result[ip]
            });
        }

        this.setState({
            options: list
        })
    };

    getSelect = (type, nextProps) => {
        let config = nextProps.currentConfig;
        let txt;
        switch (config.selectType) {
            case 1:
                txt = config.sshIP ?
                    "SSH » " + config.sshIP + " · " + config.info.name + " · " + config.info.path.substring(config.info.path.lastIndexOf("/") + 1)
                    : config.info.name + " 没有配置ssh";
                break;
            case 2:
                txt = config.sshIP ?
                    "代理 » " + config.sshIP + " · " + config.info.name + " · " + config.info.path.substring(config.info.path.lastIndexOf("/") + 1)
                    : config.info.name + " 没有配置代理";
                break;
            case 3:
                txt = config.file.ip ?
                    "文件 » " + config.file.ip + " · " + config.info.name + " · " + config.info.path.substring(config.info.path.lastIndexOf("/") + 1)
                    : config.info.name + " 没有配置ip";
                break;
            default:
                txt = "选择日志文件";

        }
        return txt;
    };

    componentDidMount() {
        this.setState({
            contentHeight: document.documentElement.clientHeight - 85//50+50+30
        });
        window.addEventListener("resize", () => {
            this.setState({
                contentHeight: document.documentElement.clientHeight - 85
            })
        });

        const nextProps = this.props;
        this.getDropDown().then(()=>{
            const nextProps = this.props;
            this.handleDropDown(nextProps.dropdown);
        });

        let config = nextProps.currentConfig;
        let txt = this.getSelect(config.selectType, nextProps);
        let disabled = false;

        this.setState({
            text: txt,
            disabled: disabled
        })
    }

    prompt = (level, msg) => {
        ['info', 'error', 'warning'].indexOf(level) > -1 && message[level](msg);
    };
    animateWidth = () => {
        console.log(this.state.contentHeight);
        console.log(this.state.animateToRight);
        this.setState({
            animateToRight: !this.state.animateToRight,
            contentHeight: document.documentElement.clientHeight - (this.state.animateToRight ? 85 : 135)
        })
        console.log(this.state.contentHeight);
        console.log(this.state.animateToRight);
    };

    render() {
        const {cmd, search} = this.state;
        const commandInputSuffix = cmd ?
            <CloseCircleOutlined style={{color: '#ccc'}} onClick={this.emitEmpty} /> : null;
        return (
            <Layout className={'layout'}>
                <Header className={'layout-header'}>
                    <Row>
                        <Col span={1}>
                            <Link to="config">
                                <AppstoreOutlined style={{fontSize: 16}} />
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
                                    <DownOutlined
                                        style={{
                                            paddingLeft: 10,
                                            color: '#ccc'
                                        }} />
                                </a>
                            </span>
                            </Cascader>
                        </Col>
                        <Col span={6}/>
                        <Col span={2}>
                            <Tooltip title="关闭/开启日志" overlayStyle={{opacity: 0.7}}>
                                <Switch defaultChecked={false} checkedChildren="开" unCheckedChildren="关"
                                        checked={this.state.checked}
                                        disabled={this.state.disabled}
                                        onChange={this.switchTail }/>
                            </Tooltip>
                        </Col>
                        <Col span={3}>
                            <Col span={6}>
                                <Tooltip title="清空日志" overlayStyle={{opacity: 0.7}}>
                                    <Button type="primary" size="small" shape="circle" icon={<RetweetOutlined />}
                                            onClick={this.clear}/>
                                </Tooltip>
                            </Col>
                            <Col span={6}>
                                <Tooltip title="命令行工具" overlayStyle={{opacity: 0.7}}>
                                    <Button type="primary" size="small" shape="circle" onClick={this.terminal}>
                                        <i className="fa fa-code"/>
                                    </Button>
                                </Tooltip>
                            </Col>
                            <Col span={6}>
                                <Tooltip title="下载日志" overlayStyle={{opacity: 0.7}}>
                                    <Button type="primary" size="small" shape="circle" icon={<DownloadOutlined />} onClick={() => {
                                        this.prompt("warning", "开发中,暂未开放");
                                    }}/>
                                </Tooltip>
                            </Col>
                            <Col span={6}>
                                <Setting {...this.props}/>
                            </Col>

                        </Col>
                    </Row>
                </Header>
                <Header className={'layout-header-second ' + (this.state.animateToRight && "animateColor")}
                        style={{zIndex: 200, paddingLeft: 0}}>
                    <Row >
                        <Col span={1}>
                            <Tooltip title="日志操作" overlayStyle={{opacity: 0.7}} placement="right">
                                <Button onClick={this.animateWidth} type="primary"
                                        style={{
                                            background: "#343842",
                                            border: 0,
                                            borderRadius: "0 25px 25px 0",
                                            boxShadow: "0px 0px 8px #121212"
                                        }}
                                >
                                    {this.state.animateToRight ?
                                        <LeftCircleOutlined style={{fontSize: 16, color: '#94a5e3'}} /> :
                                        <RightCircleOutlined style={{fontSize: 16, color: '#94a5e3'}} />
                                    }
                                </Button>
                            </Tooltip>
                        </Col>
                        <Col span={23} className={'animatedRow ' + (this.state.animateToRight && "animateWidth")}>
                            <Row style={{marginLeft: 30}}>
                                <Col span={8}>
                                    <Input className={'command-input'}
                                           placeholder="命令行"
                                        // prefix={<Icon type="right" style={{fontSize: 16, color: '#888'}}/>}
                                           prefix={<i className="fa fa-terminal"
                                                      style={{fontSize: 16, color: '#888'}}/>}
                                           suffix={commandInputSuffix}
                                           value={cmd}
                                           onChange={this.onChangeCmd}
                                           onClick={(e) => {
                                               e.stopPropagation();
                                               !this.state.animateToRight && this.setState({animateToRight: true})
                                           }}
                                           onPressEnter={this.onProcessCmd}
                                           ref={node => this.commandInput = node}
                                    />
                                </Col>
                                <Col span={12}> </Col>
                                <Col span={4}>
                                    <Input className={'search-input'}
                                           placeholder="搜索/高亮"
                                           suffix={<SearchOutlined style={{color: '#888'}} />}
                                           value={search}
                                           onClick={(e) => {
                                               e.stopPropagation()
                                           }}
                                           onChange={this.onChangeSearch}
                                           onPressEnter={this.onProcessSearch}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Header>
                <Content style={{marginTop: this.state.animateToRight ? 100 : 50}}>
                    <Spin spinning={this.state.loading}>
                        <div id="content"
                             style={{
                                 paddingLeft: 30,
                                 paddingRight: 30,
                                 paddingBottom: 20,
                                 overflowY: 'auto',
                                 height: this.state.contentHeight,
                                 wordBreak: "break-all",
                                 width: "100%"
                             }}>
                            {
                                this.state.data === [] || this.state.data.length === 0 ?
                                    < div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginTop: 120
                                    }}>
                                        <div className={'config-list-back-image4'}/>
                                    </div>
                                    :
                                    this.state.data.map((one, index) => {
                                        return this.formatOneResult(one, index);
                                    })
                            }


                        </div>
                    </Spin>
                </Content>

                {/*<CopyRight/>*/}
            </Layout>
        );
    }
}
//
// function Wrapper(props){
//     return (
//         <Logs {...props}/>
//     )
// }
class Wrapper extends React.Component{
    state = {
        currentConfig:{}
    };
    setPropConfig = (config={})=>{
        this.setState({
            currentConfig:config
        })
    };
    setConfig = (config={})=>{
        this.setPropConfig(config);
        //console.log("setConfig",config);
        this.props.setPane && this.props.setPane(config.info&&config.info.name);
    };
    render(){
        console.log(".Wrapper..",this.state.currentConfig);
        const config = this.state.currentConfig;
        if(config && config.id){
            return (
                <Logs {...this.props}
                    key={config.id}
                      setConfig={this.setConfig}
                      changeTabName={this.props.setPane}
                      currentConfig={this.state.currentConfig}/>
            )
        }

        return (
            <Logs {...this.props}
                key="-1"
                  setConfig={this.setConfig}
                  changeTabName={this.props.setPane}
                  currentConfig={this.state.currentConfig}/>
        )
    }
}
export default connect((state) => ({
    dropdown: state.dropdown,
}))(withRouter(Wrapper))