import { connect } from "react-redux";

let dispatcher = null;
let defaultState = null;
export const NavigatorReducer = (state={}, action) => {
    switch (action.type) {
        case 'navigate':
            return {[action.data.name]: action.data.value}
        default:
            return state;
    }
}

export function mapReducerStateToProps(state) {
    defaultState = state;
    return {navigator: state};
}

export function mapReducerDispatchToProps(dispatch) {
    dispatcher = dispatch;
    return {
        navigate: (data = {name: "", value: ""}) => {
            dispatch({type: "navigate", data: data});
        }
    }
}

export const InitiateNavigator = () => {};

export default connect(mapReducerStateToProps, mapReducerDispatchToProps)(InitiateNavigator);

export function Navigate(name, value, func) {
    func && func(defaultState.navigator[name]);
    dispatcher({type: "navigate", data: {name: name, value: value}});
}
export function getCurrentNavigation(name) {
    return defaultState["navigator"][name];
}