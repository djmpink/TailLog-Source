import React, {Component} from "react";
import {connect} from "react-redux";
import {Button, Card, Col, Form, Input, message, Row, Spin} from "antd";
import AjaxAction from "../../actions/AjaxAction";

const FormItem = Form.Item;
const defaultState = {
    loading: false
};

class Group extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            ...defaultState,
            ...props.group
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
        let {dispatch, group = {}} = this.props;
        let _this = this;

        let formData = Object.assign({}, this.state);
        if (!formData.name || formData.name === "") {
            message.warn("分组名称 不能为空", 3);
            return;
        }

        let values = {
            name: formData.name,
            description: formData.description,
            tag: formData.tag,
            color: formData.color,
        };

        if (group.id) {
            dispatch(AjaxAction.configGroupEdit(group.id, values)).then((data) => {
                if (data.result) {
                    message.success("编辑成功", 1.5, () => {
                        this.setState(defaultState);
                        _this.props.closeCallback && _this.props.closeCallback();
                    });

                } else {
                    message.error(data.msg);
                }
            }).catch((e) => {
                console.error(e);
            })
        } else {
            dispatch(AjaxAction.configGroupAdd(values)).then((data) => {
                if (data.result) {
                    message.success("添加成功", 1.5, () => {
                        this.setState(defaultState);
                        _this.props.closeCallback && _this.props.closeCallback();
                    });

                } else {
                    message.error(data.msg);
                }
            }).catch((e) => {
                console.error(e);
            })
        }
    };

    render() {

        return (
            <div>
                <div style={{marginTop: 15}}>
                    <Spin spinning={this.state.loading} size="large">
                        <Card
                            title="配置分组"
                            bordered={false}
                            bodyStyle={{
                                backgroundColor: "#343842",
                                color: "#888",
                                cursor: "pointer",
                                // borderTop: "1px solid #2bb669"
                            }}
                        >

                            <Form className={'config-form'} onSubmit={this.handleSubmit}>
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="name"
                                                addonBefore="组名"
                                                value={this.state.name}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'name')}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem>

                                            <Input
                                                id="description"
                                                addonBefore="描述"
                                                value={this.state.description}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'description')}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={32}>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="tag"
                                                addonBefore="标签"
                                                value={this.state.tags}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'tag')}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem>
                                            <Input
                                                id="color"
                                                addonBefore="标识"
                                                value={this.state.color}
                                                className={'config-form-input'}
                                                onChange={this.handleInputChange.bind(this, 'color')}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div style={{margin: 20, textAlign: "center"}}>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        icon="save"
                                        style={{width: "30%", fontSize: 14}}
                                        ghost
                                    >
                                        保 存
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Spin>
                </div>

            </div>
        );
    }

}

export default connect((state) => ({
    group: state.group,
}))(Group);