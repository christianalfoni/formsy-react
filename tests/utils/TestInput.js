import React from 'react';
import Formsy from './../..';

class TestInput extends React.PureComponent {
  static defaultProps = {
    type: 'text'
  }

  updateValue = (event) => {
    this.props.setValue(event.target[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    return (
      <input {...this.props} type={this.props.type} value={this.props.getValue()} onChange={this.updateValue}/>
    )
  }
}

export class ReadOnlyInput extends TestInput {
  render() {
    return <input value={this.getValue()} readOnly/>;
  }
}

export default Formsy.Mixin(TestInput);
