import React, {Component} from "react";
import {Link} from "react-router";
//styles
import "./index.scss";
export default class NoMatch extends Component {
    render() {
        return (
            <div id="react-content">
                <div id="page-404">
                    <section>
                        <h1>404</h1>
                        <p>
                            你要找的页面不存在
                        </p>
                        <Link className="link" to="/config"> 主页</Link>
                        <Link className="link" to="/login"> 登录</Link>
                    </section>
                </div>
            </div>
        )
    }
}