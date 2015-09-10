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

    const options = this.props.options.map((option, i) => (
      <option key={option.title+option.value} value={option.value}>
        {option.title}
      </option>
    ));

    return (
      <div className='form-group'>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <select name={this.props.name} onChange={this.changeValue} value={this.getValue()}>
          {options}
        </select>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }

});

export default MySelect;
