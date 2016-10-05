import React from 'react';
import { HOC as formsyHoc } from './../..';

const defaultProps = {
  methodOnWrappedInstance(param) {
    return param;
  },
  render() {
    return (<input ref={(c) => { this.input = c; }} />);
  },
};

export default formsyHoc(React.createClass(defaultProps));
