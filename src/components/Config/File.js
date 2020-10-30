import React, {Component} from "react";
import {connect} from "react-redux";
import { ExclamationCircleOutlined, InboxOutlined, SaveOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Col, Input, Row, Upload } from "antd";

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

//const defaultState = {};

class File extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        const {currentConfig = {}} = props;
        this.state = {
            //...defaultState,
            ...currentConfig.info,
            ...currentConfig.file
        };
    }

    handleInputChange = (key, event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [key]: value
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
    };

    componentWillReceiveProps(props) {
        const {currentConfig = {}} = props;
        this.setState({
            ...currentConfig.info,
            ...currentConfig.agent
        })
    }

    render() {
        const props = {
            name: 'file',
            multiple: true,
            showUploadList: true,
            action: '//jsonplaceholder.typicode.com/posts/',
            onChange: this.handleChange,
        };


        return (
            <div >
                <div>
                    <Card
                        title="上传文件"
                        bordered={false}
                        bodyStyle={{
                            backgroundColor: "#343842",
                            color: "#888",
                            cursor: "pointer",
                            // borderTop: "1px solid #2bb669"
                        }}
                    >

                        <Row style={{marginBottom: 18, marginTop: -40}}>
                            <Col span={6}/>
                            <Col span={12}>
                                <ExclamationCircleOutlined style={{color: "#f46e65"}} /><span style={{color:"#f46e65"}}> 该方式（日志文件上传）尚未完全实现。Coming Soon...</span>
                            </Col>
                            <Col span={6}/>
                        </Row>

                        <Form className={'config-form'} layout={'vertical'}>
                            <div style={{marginTop: 16, height: 180, width: "50%", margin: "0 auto", marginBottom: 0,}}>
                                <Dragger {...props} fileList={this.state.fileList}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text" style={{color: "#888"}}>点击或拖拽到此处上传文件</p>
                                </Dragger>
                            </div>
                        </Form>
                    </Card>
                </div>
                <div style={{marginTop: 20}}>
                    <Card
                        title="基本信息"
                        bordered={false}
                        bodyStyle={{
                            backgroundColor: "#343842",
                            color: "#888",
                            cursor: "pointer",
                        }}
                    >

                        <Form className={'config-form'} onSubmit={this.handleSubmit}>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <FormItem>
                                        <Input
                                            id="name"
                                            addonBefore="服务名称"
                                            value={this.state.name}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'name')}
                                        />

                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>

                                        <Input
                                            id="path"
                                            addonBefore="文件路径"
                                            value={this.state.path}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'path')}
                                        />

                                    </FormItem>
                                </Col>
                            </Row>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <FormItem>

                                        <Input
                                            id="tags"
                                            addonBefore="标签"
                                            value={this.state.tags}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'tags')}
                                        />
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem>

                                        <Input
                                            id="rule"
                                            addonBefore="解析规则"
                                            value={this.state.rule}
                                            className={'config-form-input'}
                                            onChange={this.handleInputChange.bind(this, 'rule')}
                                        />

                                    </FormItem>
                                </Col>

                            </Row>

                            <div style={{marginTop: 20, textAlign: "center"}}>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    style={{width: "30%", fontSize: 14}}
                                    ghost
                                >
                                    保 存
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        );
    }

}

export default connect((state) => ({
    currentConfig: state.currentConfig
}))(File);