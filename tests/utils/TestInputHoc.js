import React from 'react';
import { HOC as formsyHoc } from './../..';
import createReactClass from 'create-react-class';

const defaultProps = {
  methodOnWrappedInstance(param) {
    return param;
  },
  render() {
    return (<input />);
  },
};

export default formsyHoc(createReactClass(defaultProps));
