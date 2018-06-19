import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (reducer, initialState) => {
    return createStore(reducer, initialState, composeEnhancers(
        applyMiddleware(
            thunkMiddleware
        )
    ));
};