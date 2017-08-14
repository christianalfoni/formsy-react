import React from 'react';
import { withFormsy } from 'formsy-react';

class MyInput extends React.Component {
  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue = (event) => {
    this.props.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
  }

  render() {
    // Set a specific className based on the validation
    // state of this component. showRequired() is true
    // when the value is empty and the required prop is
    // passed to the input. showError() is true when the
    // value typed is invalid
    const className = 'form-group' + (this.props.className || ' ') +
      (this.props.showRequired() ? 'required' : this.props.showError() ? 'error' : '');

    // An error message is returned ONLY if the component is invalid
    // or the server has returned an error message
    const errorMessage = this.props.getErrorMessage();

    return (
      <div className={className}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input
          type={this.props.type || 'text'}
          name={this.props.name}
          onChange={this.changeValue}
          value={this.props.getValue()}
          checked={this.props.type === 'checkbox' && this.props.getValue() ? 'checked' : null}
        />
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MyInput);
