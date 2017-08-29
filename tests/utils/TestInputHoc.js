import React from 'react';
import Formsy, { withFormsy } from './../..';

class TestComponent extends React.Component {
    methodOnWrappedInstance = (param) => {
        return param;
    }

    render() {
        return (<input />);
    }
}

export default withFormsy(TestComponent);
