import React from 'react';
import Formsy from './../..';

class TestComponent extends React.Component {
    methodOnWrappedInstance = (param) => {
        return param;
    }

    render() {
        return (<input />);
    }
}

export default Formsy.Wrapper(TestComponent);
