import React from 'react';
import Formsy from 'formsy-react';

const MySelect = React.createClass({
  mixins: [Formsy.Mixin],

  changeValue(event) {
    this.setValue(event.currentTarget.value);
  },

  render() {
    const className = this.props.className + ' ' + (this.showRequired() ? 'required' : this.showError() ? 'error' : null);
    const errorMessage = this.getErrorMessage();

    const value = this.getValue();
    const options = this.props.options.map(option => (
      <option value={option.value} selected={value === option.value ? 'selected' : null}>
        {option.title}
      </option>
    ));

    return (
      <div className='form-group'>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <select name={this.props.name} onChange={this.changeValue}>
          {options}
        </select>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }

});

export default MySelect;
