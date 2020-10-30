import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider} from "react-redux";
import configureStore from "./configureStore";
//reducers
import Reducer from "./reducers";
import InitReducer from "./initReducer";
//routers
import Login from "./routers/Login";
import Reg from "./routers/Reg";
import RegAwait from "./routers/Reg/RegAwait";
import Activate from "./routers/Reg/Activate";
import Pwd from "./routers/Pwd";
import Reset from "./routers/Pwd/Reset";
import multi from "./routers/Logs/Multi";
import Term from "./routers/Term";
import Config from "./routers/Config/index";
import AgentList from "./routers/Config/AgentList";
import SSHList from "./routers/Config/SSHList";
import GroupList from "./routers/Config/GroupList";
import Callback from "./routers/Login/Callback";
import Binding from "./routers/Binding";
import UserSetting from "./routers/Settings/UserSetting";
import NoMatch from "./routers/NoMatch";
//styles
import "./index.scss";
import reportWebVitals from './reportWebVitals';

//store
const store = configureStore(Reducer, InitReducer);
class TheApp extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" component={Config}/>
                    <Route path="login" component={Login}/>
                    <Route path="reg" component={Reg}/>
                    <Route path="await" component={RegAwait}/>
                    <Route path="activate" component={Activate}/>
                    <Route path="pwd" component={Pwd}/>
                    <Route path="reset" component={Reset}/>
                    <Route path="binding" component={Binding}/>
                    <Route path="userSetting" component={UserSetting}/>
                    <Route path="logs" component={multi}/>
                    <Route path="multi" component={multi}/>
                    <Route path="term" component={Term}/>
                    <Route path="config" component={Config}/>
                    <Route path="ssh" component={SSHList}/>
                    <Route path="agent" component={AgentList}/>
                    <Route path="group" component={GroupList}/>
                    <Route path="callback/:platform" component={Callback}/>
                    <Route path="*" component={NoMatch}/>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <TheApp/>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
