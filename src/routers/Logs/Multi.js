import React from "react";
import {connect} from "react-redux";
import {Layout, Tabs} from "antd";
import Logs from "../Logs";
import "./logs.scss";


const TabPane = Tabs.TabPane;

//日志多标签展示页
class Multi extends React.Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        this.state = {
            activeKey: '1',
            panes: [{key:'1',title:"选择日志",closable: false}],
        };
    }

    onChange = (activeKey) => {
        this.setState({activeKey});
    };
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    add = () => {
        const panes = this.state.panes;
        const activeKey = `${panes.length + 1}`;
        panes.push({title: '选择日志', key: activeKey});
        this.setState({panes, activeKey}, () => {
            this[`log${activeKey}`] && this[`log${activeKey}`].getWrappedInstance().setPropConfig({id: "-1"});
        });
    };
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes, activeKey});
    };

    setPane = (key, name) => {

        //console.log(key,name,'setPane')
        const panes = this.state.panes.filter(pane => {
            if (pane.key === key) {
                pane.title = name;
            }
            return pane;
        });
        //console.log(panes);

        this.setState({panes});
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.currentConfig) {
            //this.refs[log``]
            console.log(nextProps.currentConfig);
            const key = "1";
            // eslint-disable-next-line
            this.state.panes && (this.state.panes[0]=({
                title: nextProps.currentConfig.info.name,
                key: key,
                closable: false
            }));
            this.setState({}, () => {
                this[`log${key}`] && this[`log${key}`].getWrappedInstance().setPropConfig(nextProps.currentConfig);
            })

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout className="multi-layout">
                <Tabs className="multi-tab"
                      onChange={this.onChange}
                      activeKey={this.state.activeKey}
                      type="editable-card"
                      onEdit={this.onEdit}
                      tabPosition={'bottom'}
                      style={{width: "100%", backgroundColor: "#292c35"}}
                >
                    {
                        this.state.panes.map(pane =>
                            <TabPane className="multi-pane" tab={pane.title} key={pane.key} closable={pane.closable}>
                                <Logs ref={(name) => {
                                    this[`log${pane.key}`] = name
                                }} key={pane.key} setPane={this.setPane.bind(this, pane.key)}
                                      router={this.props.router}/>
                            </TabPane>)
                    }
                </Tabs>
            </Layout>
        )
    }
}
export default connect((state) => ({
    currentConfig: state.currentConfig
}))(Multi)