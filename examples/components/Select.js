import React from 'react';
import { withFormsy } from 'formsy-react';

class MySelect extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const className = 'form-group' + (this.props.className || ' ') +
      (this.props.showRequired() ? 'required' : this.props.showError() ? 'error' : '');
    const errorMessage = this.props.getErrorMessage();

    const options = this.props.options.map((option, i) => (
      <option key={option.title+option.value} value={option.value}>
        {option.title}
      </option>
    ));

    return (
      <div className={className}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <select name={this.props.name} onChange={this.changeValue} value={this.props.getValue()}>
          {options}
        </select>
        <span className='validation-error'>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MySelect);
