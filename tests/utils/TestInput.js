import React from 'react';
import Formsy from './../..';

class TestInput extends React.Component {
  static defaultProps = {
    type: 'text'
  }

  updateValue(event) {
    this.props.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    return <input type={this.props.type} value={this.props.getValue()} onChange={this.updateValue}/>;
  }
}

export const InputFactory = (props) => (
  <TestInput {...props} />
)

export default Formsy.Mixin(TestInput);
