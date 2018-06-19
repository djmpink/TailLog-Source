import React, {Component} from "react";
import "./index.scss";
import {Layout} from "antd";
const {Header, Content, Footer} = Layout;

class Right extends Component {
    close = () => {
        this.props.close && this.props.close()
    };

    render() {
        let {header, footer, children, show} = this.props;
        return (
            show ?
                <div className="right-detail" onClick={this.close} style={this.props.style}>
                    <div className="content" onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <Layout className={'layout'}>
                            {header &&
                            <Header className={'layout-header'}>
                                {header}
                            </Header>
                            }

                            <Content
                                className={'layout-content'}
                                style={{
                                    height: document.documentElement.clientHeight - 50
                                }}>
                                {children}
                            </Content>

                            {footer &&
                            <Footer className={'layout-footer'}>
                                {footer}
                            </Footer>
                            }
                        </Layout>
                    </div>
                </div>
                : null
        );
    }
}
export default Right;