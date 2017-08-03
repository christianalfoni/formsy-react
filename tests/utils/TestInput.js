import React from 'react';
import Formsy from './../..';

class TestInput extends React.Component {
    static defaultProps = { type: 'text' };

    updateValue = (event) => {
        this.props.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
    }

    render() {
        return <input type={this.props.type} value={this.props.getValue()} onChange={this.updateValue}/>;
    }
}

export function InputFactory(methods) {
    for (let method in methods) {
        if (methods.hasOwnProperty(method)) {
            TestInput.prototype[method] = methods[method];
        }
    }
    return Formsy.Wrapper(TestInput);
}

export default Formsy.Wrapper(TestInput);
