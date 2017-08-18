import React from 'react';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';

import MyInput from './../components/Input';
import MySelect from './../components/Select';
import MyRadioGroup from './../components/RadioGroup';
import MyMultiCheckboxSet from './../components/MultiCheckboxSet';

const Fields = props => {
  function onRemove(pos) {
    return event => {
      event.preventDefault();
      props.onRemove(pos);
    };
  }

  return (
    <div className="fields">
      {props.data.map((field, i) => (
        <div className="field" key={field.id}>
          {
            field.type === 'input' ?
            (
              <MyInput
                value=""
                name={`fields[${i}]`}
                title={field.validations ? JSON.stringify(field.validations) : 'No validations'}
                required={field.required}
                validations={field.validations}
              />
            ) :
            (
              <MySelect
                name={`fields[${i}]`}
                title={field.validations ? JSON.stringify(field.validations) : 'No validations'}
                required={field.required}
                validations={field.validations}
                options={[
                  {title: '123', value: '123'},
                  {title: 'some long text', value: 'some long text'},
                  {title: '`empty string`', value: ''},
                  {title: 'alpha42', value: 'alpha42'},
                  {title: 'test@mail.com', value: 'test@mail.com'}
                ]}
              />
            )
          }
          <button className="remove-field" onClick={onRemove(i)}>X</button>
        </div>
      ))
    }
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fields: [], canSubmit: false };
    this.addField = this.addField.bind(this);
    this.removeField = this.removeField.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.disableButton = this.disableButton.bind(this);
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  addField(fieldData) {
    fieldData.validations = fieldData.validations.length ?
      fieldData.validations.reduce((a, b) => Object.assign({}, a, b)) :
      null;
    fieldData.id = Date.now();
    this.setState({ fields: this.state.fields.concat(fieldData) });
  }

  removeField(pos) {
    const fields = this.state.fields;
    this.setState({ fields: fields.slice(0, pos).concat(fields.slice(pos+1)) })
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  render() {
    const { fields, canSubmit } = this.state;
    return (
      <div>
        <Formsy onSubmit={this.addField} className="many-fields-conf">
          <MyMultiCheckboxSet
            name="validations"
            title="Validations"
            cmp={(a, b) => JSON.stringify(a) === JSON.stringify(b)}
            items={[
              {isEmail: true},
              {isEmptyString: true},
              {isNumeric: true},
              {isAlphanumeric: true},
              {equals: 5},
              {minLength: 3},
              {maxLength: 7}
            ]}
          />
          <MyRadioGroup
            name="required"
            value={false}
            title="Required"
            items={[true, false]}
          />
          <MyRadioGroup
            name="type"
            value="input"
            title="Type"
            items={['input', 'select']}
          />
          <button type="submit">Add</button>
        </Formsy>
        <Formsy onSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} className="many-fields">
          <Fields data={fields} onRemove={this.removeField} />
          <button type="submit" disabled={!canSubmit}>Submit</button>
        </Formsy>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
