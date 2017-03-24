import React from 'react';
import Formsy from './../..';

const defaultProps = {
  mixins: [Formsy.Mixin],
  getDefaultProps() {
    return { type: 'text' };
  },
  changeValue(event) {
    this.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  },
  render() {
    return <input type={this.props.type} value={this.getValue()} onChange={this.changeValue}/>;
  }
};

export function InputFactory(props) {
  return React.createClass(Object.assign(defaultProps, props));
}

export default React.createClass(defaultProps);
