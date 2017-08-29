import Formsy, { addValidationRule, propTypes, withFormsy } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import MyInput from './../components/Input';

const currentYear = new Date().getFullYear();

addValidationRule('time', (values, value) => {
  return /^(([0-1]?[0-9])|([2][0-3])):([0-5]?[0-9])(:([0-5]?[0-9]))?$/.test(value);
});
addValidationRule('decimal', (values, value) => {
  return /(^\d*\.?\d*[0-9]+\d*$)|(^[0-9]+\d*\.\d*$)/.test(value);
});
addValidationRule('binary', (values, value) => {
  return /^([0-1])*$/.test(value);
});
addValidationRule('isYearOfBirth', (values, value) => {
  const parsedValue = parseInt(value, 10);
  if (typeof parsedValue !== 'number') {
    return false;
  }
  return parsedValue < currentYear && parsedValue > currentYear - 130;
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  render() {
    return (
      <Formsy onSubmit={this.submit} className="custom-validation">
        <MyInput name="year" title="Year of Birth" type="number" validations="isYearOfBirth" validationError="Please type your year of birth" />
        <FormsyDynamicInput name="dynamic" title="..." />
        <button type="submit">Submit</button>
      </Formsy>
    );
  }
}

class DynamicInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { validationType: 'time' };
    this.changeValidation = this.changeValidation.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValidation(validationType) {
    this.setState({ validationType: validationType });
    this.props.setValue(this.props.getValue());
  }

  changeValue(event) {
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    const errorMessage = {
      time: 'Not a valid time format',
      decimal: "Not a valid decimal value",
      binary: "Not a valid binary number"
    }

    return (
      <div>
        <label htmlFor={this.props.name}>{this.props.title}</label>
        <MyInput validations={this.state.validationType} validationError={errorMessage[this.state.validationType]} type='text' name={this.props.name} onChange={this.changeValue} value={this.props.getValue() || ''} />
        <Validations validationType={this.state.validationType} changeValidation={this.changeValidation} />
      </div>
    );
  }
}

DynamicInput.displayName = "dynamic input";

DynamicInput.propTypes = {
  ...propTypes,
};

const FormsyDynamicInput = withFormsy(DynamicInput);

class Validations extends React.Component {
  constructor(props) {
    super(props);
    this.changeValidation = this.changeValidation.bind(this);
  }

  changeValidation(e) {
    this.props.changeValidation(e.target.value);
  }

  render() {
    const { validationType } = this.props;
    return (
      <fieldset>
        <legend>Validation Type</legend>
        <div>
          <input onChange={this.changeValidation} name='validationType' type='radio' value='time' checked={validationType === 'time'} />Time
        </div>
        <div>
          <input onChange={this.changeValidation} name='validationType' type='radio' value='decimal' checked={validationType === 'decimal'} />Decimal
        </div>
        <div>
          <input onChange={this.changeValidation} name='validationType' type='radio' value='binary' checked={validationType === 'binary'} />Binary
        </div>
      </fieldset>
    );
  }
}

Validations.propTypes = {
  changeValidation: PropTypes.func.isRequired,
  validationType: PropTypes.string.isRequired,
};

ReactDOM.render(<App />, document.getElementById('example'));
