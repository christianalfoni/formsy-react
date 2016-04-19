import React from 'react';
import Formsy from './../..';

const defaultProps = {
  mixins: [Formsy.Mixin],
  getDefaultProps() {
    return { type: 'text' };
  },
  updateValue(event) {
    this.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  },
  render() {
    return <input type={this.props.type} value={this.getValue()} onChange={this.updateValue}/>;
  }
};

export function InputFactory(props) {
  return React.createClass(Object.assign(defaultProps, props));
}

export default React.createClass(defaultProps);
