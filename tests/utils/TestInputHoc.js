import React from 'react';
import { HOC as formsyHoc } from './../..';

class TestInput extends React.Component {
  methodOnWrappedInstance(param) {
    return param;
  }

  render() {
    return <input  />
  }
}

export default formsyHoc(TestInput);
