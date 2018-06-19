import React from "react";
import {Badge, Col, Layout, Row} from "antd";
const {Footer} = Layout;
export default () => (

    <Footer className={'layout-footer'}>
        <Row/>
        <Col span={8}/>
        <Col span={8}>
            © 2017「 <a href="http://www.taillog.cn/" target="_blank" rel="noopener noreferrer">TailLog</a> 」
            <a href="http://www.taillog.cn/help.html" target="_blank" rel="noopener noreferrer">v1.0.0-20171204</a>
        </Col>
        <Col span={4}/>
        <Col span={4}>
            {
                localStorage['token'] ?
                    <Badge status="success"
                           text={
                               <span style={{color: "#888"}}>在线</span>
                           }/>
                    :
                    <Badge status="warning"
                           text={
                               <span style={{color: "#888"}}>本地</span>
                           }/>
            }
        </Col>
        <Row/>


    </Footer>

)