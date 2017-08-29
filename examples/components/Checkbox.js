import React from 'react';
import { propTypes, withFormsy } from 'formsy-react';

class MyCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this.state = {
      value: true,
    };
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    this.props.setValue(event.target.checked)
  }

  render() {
    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    const className = `form-group ${this.props.className} ${this.props.showRequired() ? 'required' : ''} ${this.props.showError() ? 'error' : ''}`;
    const value = this.props.getValue();
    return (
      <div
        className={className}
      >
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input
          onChange={this.changeValue}
          id={this.props.name}
          type='checkbox'
          checked={value}
          data-checked={value}
        />
      </div>
    );
  }
}

MyCheckbox.propTypes = {
  ...propTypes,
};

export default withFormsy(MyCheckbox);
