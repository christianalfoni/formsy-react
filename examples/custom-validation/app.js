import React from 'react';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';

import MyInput from './../components/Input';

const currentYear = new Date().getFullYear();

const validators = {
  time: {
    regexp: /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/,
    message: 'Not valid time'
  },
  decimal: {
    regexp: /(^\d*\.?\d*[0-9]+\d*$)|(^[0-9]+\d*\.\d*$)/,
    message: 'Please type decimal value'
  },
  binary: {
    regexp: /^([0-1])*$/,
    message: '10101000'
  }
};

Formsy.addValidationRule('isYearOfBirth', (values, value) => {
  value = parseInt(value);
  if (typeof value !== 'number') {
    return false;
  }
  return value < currentYear && value > currentYear - 130;
});

class App extends React.Component {
  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }
  render() {
    return (
      <Formsy.Form onSubmit={this.submit} className="custom-validation">
        <MyInput name="year" title="Year of Birth" type="number" validations="isYearOfBirth" validationError="Please type your year of birth" />
        <FormsyDynamicInput name="dynamic" title="..." />
        <button type="submit">Submit</button>
      </Formsy.Form>
    );
  }
}

class DynamicInput extends React.Component {
  state = { validationType: 'time' };
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  changeValidation = (validationType) => {
    this.setState({ validationType: validationType });
    this.props.setValue(this.props.getValue());
  }
  validate = () => {
    const value = this.props.getValue();
    console.log(value, this.state.validationType);
    return value ? validators[this.state.validationType].regexp.test(value) : true;
  }
  getCustomErrorMessage = () => {
    return this.props.showError() ? validators[this.state.validationType].message : '';
  }
  render() {
    const className = 'form-group' + (this.props.className || ' ') + (this.props.showRequired() ? 'required' : this.props.showError() ? 'error' : null);
    const errorMessage = this.getCustomErrorMessage();

    return (
      <div className={className}>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <input type='text' name={this.props.name} onChange={this.changeValue} value={this.props.getValue() || ''}/>
        <span className='validation-error'>{errorMessage}</span>
        <Validations validationType={this.state.validationType} changeValidation={this.changeValidation}/>
      </div>
    );
  }
}
const FormsyDynamicInput = Formsy.Wrapper(DynamicInput);

class Validations extends React.Component {
  changeValidation = (e) => {
    this.props.changeValidation(e.target.value);
  }
  render() {
    const { validationType } = this.props;
    return (
      <fieldset onChange={this.changeValidation}>
        <legend>Validation Type</legend>
        <div>
          <input name='validationType' type='radio' value='time' defaultChecked={validationType === 'time'}/>Time
        </div>
        <div>
          <input name='validationType' type='radio' value='decimal' defaultChecked={validationType === 'decimal'}/>Decimal
        </div>
        <div>
          <input name='validationType' type='radio' value='binary' defaultChecked={validationType === 'binary'}/>Binary
        </div>
      </fieldset>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('example'));
