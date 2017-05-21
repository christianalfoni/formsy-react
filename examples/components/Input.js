import React from 'react';
import Formsy, { HOC as FormsyWrapper } from 'formsy-react';

class MyInput extends React.Component {

  constructor() {
    super();
    this.changeValue = this.changeValue.bind(this);
  }

  static propTypes = {
    title: React.propTypes.string,
    name: React.propTypes.string,
    className: React.propTypes.string,
    type: React.propTypes.string,
    setValue: React.propTypes.func,
    showError: React.propTypes.func,
    showRequired: React.propTypes.func,
    getErrorMessage: React.propTypes.func
  }
  // Add the Formsy Mixin

  // setValue() will set the value of the component, which in
  // turn will validate it and the rest of the form
  changeValue(event) {
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
        <label
          htmlFor={this.props.name}>
          {this.props.title}
        </label>
        <input
          type={this.props.type || 'text'}
          name={this.props.name}
          onChange={this.changeValue}
          value={this.props.getValue()}
          checked={this.props.type === 'checkbox' && this.getValue() ? 'checked' : null}
        />
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
}

export default FormsyWrapper(MyInput);
