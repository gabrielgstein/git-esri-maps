import React, {Component} from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/main';
import App from './container-components/app';

export const store = createStore(reducer);

export default class RootComponent extends Component {

    render() {

        return (
            <Provider store={store}>
                <App {...this.props}/>
            </Provider>
        )
    }

}