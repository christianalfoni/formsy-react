# API

-   [Formsy](#formsy)
    -   [mapping](#mapping)
    -   [validationErrors](#validationErrors)
    -   [onSubmit()](#onSubmit)
    -   [onValid()](#onValid)
    -   [onInvalid()](#onInvalid)
    -   [onValidSubmit()](#onValidsubmit)
    -   [onInvalidSubmit()](#onInvalidsubmit)
    -   [onChange()](#onChange)
    -   [reset()](#reset)
    -   [getModel()](#getModel)
    -   [updateInputsWithError()](#updateInputsWithError)
    -   [preventExternalInvalidation](#preventExternalInvalidation)
-   [withFormsy](#withFormsy)
    -   [name](#name)
    -   [innerRef](#innerRef)
    -   [value](#value)
    -   [validations](#validations)
    -   [validationError](#validationError)
    -   [validationErrors](#validationErrors)
    -   [required](#required)
    -   [getValue()](#getvalue)
    -   [setValue()](#setValue)
    -   [resetValue()](#resetValue)
    -   [getErrorMessage()](#getErrorMessage)
    -   [getErrorMessages()](#getErrorMessages)
    -   [isValid()](#isValid)
    -   [isValidValue()](#isValidValue)
    -   [isRequired()](#isRequired)
    -   [showRequired()](#showRequired)
    -   [showError()](#showError)
    -   [isPristine()](#isPristine)
    -   [isFormDisabled()](#isFormDisabled)
    -   [isFormSubmitted()](#isFormSubmitted)
    -   [formNoValidate](#formNoValidate)
-   [propTypes](#propTypes)
-   [addValidationRule](#addValidationRule)
-   [Validators](#validators)

### <a id="formsy">Formsy</a>

`import Formsy from 'react-formsy';`

#### <a id="mapping">mapping</a>

```jsx
class MyForm extends React.Component {
  mapInputs(inputs) {
    return {
      'field1': inputs.foo,
      'field2': inputs.bar
    };
  }
  submit(model) {
    model; // {field1: '', field2: ''}
  }
  render() {
    return (
      <Formsy onSubmit={this.submit} mapping={this.mapInputs}>
        <MyInput name="foo" value=""/>
        <MyInput name="bar" value=""/>
      </Formsy>
    );
  }
}
```

Use mapping to change the data structure of your input elements. This structure is passed to the submit hooks.

#### <a id="validationErrors">validationErrors</a>

You can manually pass down errors to your form. In combination with `onChange` you are able to validate using an external validator.

```jsx
class Form extends React.Component {
  state = { validationErrors: {} };
  validateForm = (values) => {
    if (!values.foo) {
      this.setState({
        validationErrors: {
          foo: 'Has no value'
        }
      });
    } else {
      this.setState({
        validationErrors: {}
      });
    }
  }
  render() {
    return (
      <Formsy onChange={this.validateForm} validationErrors={this.state.validationErrors}>
        <MyFormElement name="foo"/>
      </Formsy>
    );
  }
}
```

#### <a id="onSubmit">onSubmit(data, resetForm, invalidateForm)</a>

```jsx
<Formsy onSubmit={this.showFormLoader}></Formsy>
```

Takes a function to run when the submit button has been clicked.

The first argument is the data of the form. The second argument will reset the form. The third argument will invalidate the form by taking an object that maps to inputs. This is useful for server side validation. E.g. `{email: "This email is taken"}`. Resetting or invalidating the form will cause **setState** to run on the form element component.

#### <a id="onValid">onValid()</a>

```jsx
<Formsy onValid={this.enableSubmitButton}></Formsy>
```

Whenever the form becomes valid the "onValid" handler is called. Use it to change state of buttons or whatever your heart desires.

#### <a id="onInvalid">onInvalid()</a>

```jsx
<Formsy onInvalid={this.disableSubmitButton}></Formsy>
```

Whenever the form becomes invalid the "onInvalid" handler is called. Use it to for example revert "onValid" state.

#### <a id="onValidsubmit">onValidSubmit(model, resetForm, invalidateForm)</a>

```jsx
<Formsy onValidSubmit={this.sendToServer}></Formsy>
```

Triggers when form is submitted with a valid state. The arguments are the same as on `onSubmit`.

#### <a id="onInvalidsubmit">onInvalidSubmit(model, resetForm, invalidateForm)</a>

```jsx
<Formsy onInvalidSubmit={this.notifyFormError}></Formsy>
```

Triggers when form is submitted with an invalid state. The arguments are the same as on `onSubmit`.

#### <a id="onChange">onChange(currentValues, isChanged)</a>

```jsx
<Formsy onChange={this.saveCurrentValuesToLocalStorage}></Formsy>
```

"onChange" triggers when setValue is called on your form elements. It is also triggered when dynamic form elements have been added to the form. The "currentValues" is an object where the key is the name of the input and the value is the current value. The second argument states if the forms initial values actually has changed.

#### <a id="reset">reset(values)</a>

```jsx
class MyForm extends React.Component {
  resetForm = () => {
    this.refs.form.reset();
  }
  render() {
    return (
      <Formsy ref="form">
        ...
      </Formsy>
    );
  }
}
```

Manually reset the form to its pristine state. You can also pass an object that inserts new values into the inputs. Keys are name of input and value is of course the value.

#### <a id="getModel">getModel()</a>

```jsx
class MyForm extends React.Component {
  getMyData = () => {
    alert(this.refs.form.getModel());
  }
  render() {
    return (
      <Formsy ref="form">
        ...
      </Formsy>
    );
  }
}
```

Manually get values from all registered components. Keys are name of input and value is of course the value.

#### <a id="updateInputsWithError">updateInputsWithError(errors)</a>

```jsx
class MyForm extends React.Component {
  someFunction = () => {
    this.refs.form.updateInputsWithError({
      email: 'This email is taken',
      'field[10]': 'Some error!'
    });
  }
  render() {
    return (
      <Formsy ref="form">
        ...
      </Formsy>
    );
  }
}
```

Manually invalidate the form by taking an object that maps to inputs. This is useful for server side validation. You can also use a third parameter to the [`onSubmit`](#onSubmit), [`onValidSubmit`](#onValid) or [`onInvalidSubmit`](#onInvalid).

#### <a id="preventExternalInvalidation">preventExternalInvalidation</a>

```jsx
class MyForm extends React.Component {
  onSubmit(model, reset, invalidate) {
    invalidate({
      foo: 'Got some error'
    });
  }
  render() {
    return (
      <Formsy onSubmit={this.onSubmit} preventExternalInvalidation>
        ...
      </Formsy>
    );
  }
}
```

With the `preventExternalInvalidation` the input will not be invalidated though it has an error.

### <a id="withFormsy">`withFormsy`</a>

All Formsy input components must be wrapped in the `withFormsy` higher-order component, which provides the following properties and methods through `props`.

```jsx
import { withFormsy } from 'formsy-react';

class MyInput extends React.Component {
  render() {
    return (
      <div>
        <input value={this.props.getValue()} onChange={(e) => this.props.setValue(e.target.value)}/>
      </div>
    );
  }
}
export default withFormsy(MyInput);
```

#### <a id="name">name</a>

```jsx
<MyInput name="email"/>
<MyInput name="address.street"/>
```

The name is required to register the form input component in the form. You can also use dot notation. This will result in the "form model" being a nested object. `{email: 'value', address: {street: 'value'}}`.

#### <a id="innerRef">innerRef</a>

Use an `innerRef` prop to get a reference to your DOM node.

```jsx
class MyForm extends React.Component {
  componentDidMount() {
    this.searchInput.focus()
  }
  render() {
    return (
      <Formsy>
        <MyInput name="search" innerRef={(c) => { this.searchInput = c; }} />
      </Formsy>
    );
  }
}
```

#### <a id="value">value</a>

```jsx
<MyInput name="email" value="My initial value"/>
```

You should always use the [**getValue()**](#getvalue) method inside your formsy form element. To pass an initial value, use the value attribute. This value will become the "pristine" value and any reset of the form will bring back this value.

#### <a id="validations">validations</a>

```jsx
<MyInput name="email" validations="isEmail"/>
<MyInput name="number" validations="isNumeric,isLength:5"/>
<MyInput name="number" validations={{
  isNumeric: true,
  isLength: 5
}}/>
<MyInput name="number" validations={{
  myCustomIsFiveValidation: function (values, value) {
    values; // Other current values in form {foo: 'bar', 'number': 5}
    value; // 5
    return 5 === value ? true : 'No five'; // You can return an error
  }
}}/>
```

A comma separated list with validation rules. Take a look at [**Validators**](#validators) to see default rules. Use ":" to separate argument passed to the validator. The argument will go through a **JSON.parse** converting them into correct JavaScript types. Meaning:

```jsx
<MyInput name="fruit" validations="isIn:['apple', 'orange']"/>
<MyInput name="car" validations="mapsTo:{'bmw': true, 'vw': true}"/>
```

Works just fine.

#### <a id="validationError">validationError</a>

```jsx
<MyInput name="email" validations="isEmail" validationError="This is not an email"/>
```

The message that will show when the form input component is invalid. It will be used as a default error.

#### <a id="validationErrors">validationErrors</a>

```jsx
<MyInput
  name="email"
  validations={{
    isEmail: true,
    maxLength: 50
  }}
  validationErrors={{
    isEmail: 'You have to type valid email',
    maxLength: 'You can not type in more than 50 characters'
  }}
/>
```

The message that will show when the form input component is invalid. You can combine this with `validationError`. Keys not found in `validationErrors` defaults to the general error message.

#### <a id="required">required</a>

```jsx
<MyInput name="email" validations="isEmail" validationError="This is not an email" required/>
```

A property that tells the form that the form input component value is required. By default it uses `isDefaultRequiredValue`, but you can define your own definition of what defined a required state.

```jsx
<MyInput name="email" required="isFalse"/>
```

Would be typical for a checkbox type of form element that must be checked, e.g. agreeing to Terms of Service.

#### <a id="getvalue">getValue()</a>

```jsx
class MyInput extends React.Component {
  render() {
    return (
      <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
    );
  }
}
```

Gets the current value of the form input component.

#### <a id="setValue">setValue(value\[, validate = true])</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    return (
      <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
    );
  }
}
```

Sets the value of your form input component. Notice that it does not have to be a text input. Anything can set a value on the component. Think calendars, checkboxes, autocomplete stuff etc. Running this method will trigger a **setState()** on the component and do a render.

You can also set the value without forcing an immediate validation by passing a second parameter of `false`. This is useful in cases where you want to only validate on blur / change / etc.

#### <a id="resetValue">resetValue()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <button onClick={this.props.resetValue()}>Reset</button>
      </div>
    );
  }
}
```

Resets to empty value. This will run a **setState()** on the component and do a render.

#### <a id="getErrorMessage">getErrorMessage()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.getErrorMessage()}</span>
      </div>
    );
  }
}
```

Will return the validation message set if the form input component is invalid. If form input component is valid it returns **null**.

#### <a id="getErrorMessages">getErrorMessages()</a>

Will return the validation messages set if the form input component is invalid. If form input component is valid it returns empty array.

#### <a id="isValid">isValid()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    var face = this.props.isValid() ? ':-)' : ':-(';
    return (
      <div>
        <span>{face}</span>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.getErrorMessage()}</span>
      </div>
    );
  }
}
```

Returns the valid state of the form input component.

#### <a id="isValidValue">isValidValue()</a>

You can pre-verify a value against the passed validators to the form element.

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    if (this.isValidValue(event.target.value)) {
      this.props.setValue(event.target.value);
    }
  }
  render() {
    return <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>;
  }
});

class MyForm extends React.Component {
  render() {
    return (
      <Formsy>
        <MyInput name="foo" validations="isEmail"/>
      </Formsy>
    );
  }
}
```

#### <a id="isRequired">isRequired()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    return (
      <div>
        <span>{this.props.label} {this.props.isRequired() ? '*' : null}</span>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.getErrorMessage()}</span>
      </div>
    );
  }
}
```

Returns true if the required property has been passed.

#### <a id="showRequired">showRequired()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    var className = this.props.showRequired() ? 'required' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.getErrorMessage()}</span>
      </div>
    );
  }
}
```

Lets you check if the form input component should indicate if it is a required field. This happens when the form input component value is empty and the required prop has been passed.

#### <a id="showError">showError()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    var className = this.props.showRequired() ? 'required' : this.props.showError() ? 'error' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.getErrorMessage()}</span>
      </div>
    );
  }
}
```

Lets you check if the form input component should indicate if there is an error. This happens if there is a form input component value and it is invalid or if a server error is received.

#### <a id="isPristine">isPristine()</a>

```jsx
class MyInput extends React.Component {
  changeValue = (event) => {
    this.props.setValue(event.currentTarget.value);
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.props.getValue()}/>
        <span>{this.props.isPristine() ? 'You have not touched this yet' : ''}</span>
      </div>
    );
  }
}
```

By default all Formsy input elements are pristine, which means they are not "touched". As soon as the [**setValue**](#setValue) method is run it will no longer be pristine.

**note!** When the form is reset (using `reset(...)`) the inputs are reset to their pristine state.

#### <a id="isFormDisabled">isFormDisabled()</a>

```jsx
class MyInput extends React.Component {
  render() {
    return (
      <div>
        <input type="text" value={this.props.getValue()} disabled={this.props.isFormDisabled()}/>
      </div>
    );
  }
}

React.render(<Formsy disabled={true}/>);
```

You can now disable the form itself with a prop and use **isFormDisabled()** inside form elements to verify this prop.

#### <a id="isFormSubmitted">isFormSubmitted()</a>

```jsx
class MyInput extends React.Component {
  render() {
    var error = this.props.isFormSubmitted() ? this.props.getErrorMessage() : null;
    return (
      <div>
        <input type="text" value={this.props.getValue()}/>
        {error}
      </div>
    );
  }
}
```

You can check if the form has been submitted.

#### <a id="formNoValidate">formNoValidate</a>

To avoid native validation behavior on inputs, use the React `formNoValidate` property.

```jsx
class MyInput extends React.Component {
  render() {
    return (
      <div>
        <input formNoValidate type="number"/>
      </div>
    );
  }
}
```

### <a id="propTypes">`propTypes`</a>

If you are using React's PropType type checking, you can spread Formsy’s propTypes into your local propTypes to avoid having to repeatedly add `withFormsy`’s methods to your components.

```jsx
import PropTypes from 'prop-types';
import { propTypes } from 'formsy-react';

class MyInput extends React.Component {
  static propTypes = {
    firstProp: PropTypes.string,
    secondProp: PropTypes.object,
    ...propTypes
  }
}

MyInput.propTypes = {
  firstProp: PropTypes.string,
  secondProp: PropTypes.object,
  ...propTypes,
};
```

### <a id="addValidationRule">`addValidationRule(name, ruleFunc)`</a>

`import { addValidationRule } from 'formsy-react';`

An example:

```jsx
addValidationRule('isFruit', function (values, value) {
  return ['apple', 'orange', 'pear'].indexOf(value) >= 0;
});
```

```jsx
<MyInput name="fruit" validations="isFruit"/>
```

Another example:

```jsx
addValidationRule('isIn', function (values, value, array) {
  return array.indexOf(value) >= 0;
});
```

```jsx
<MyInput name="fruit" validations="isIn:['apple', 'orange', 'pear']"/>
```

Cross input validation:

```jsx
addValidationRule('isMoreThan', function (values, value, otherField) {
  // The this context points to an object containing the values
  // {childAge: "", parentAge: "5"}
  // otherField argument is from the validations rule ("childAge")
  return Number(value) > Number(values[otherField]);
});
```

```jsx
<MyInput name="childAge"/>
<MyInput name="parentAge" validations="isMoreThan:childAge"/>
```

## <a id="validators">Validators</a>

**matchRegexp**

```jsx
<MyInput name="foo" validations={{
  matchRegexp: /foo/
}}/>
```

Returns true if the value is thruthful

_For more complicated regular expressions (emoji, international characters) you can use [xregexp](https://github.com/slevithan/xregexp). See [this comment](https://github.com/christianalfoni/formsy-react/issues/407#issuecomment-266306783) for an example._

**isEmail**

```jsx
<MyInput name="foo" validations="isEmail"/>
```

Return true if it is an email

**isUrl**

```jsx
<MyInput name="foo" validations="isUrl"/>
```

Return true if it is an url

**isExisty**

```jsx
<MyInput name="foo" validations="isExisty"/>
```

Returns true if the value is not undefined or null

**isUndefined**

```jsx
<MyInput name="foo" validations="isUndefined"/>
```

Returns true if the value is the undefined

**isEmptyString**

```jsx
<MyInput name="foo" validations="isEmptyString"/>
```

Returns true if the value is an empty string

**isTrue**

```jsx
<MyInput name="foo" validations="isTrue"/>
```

Returns true if the value is the boolean true

**isFalse**

```jsx
<MyInput name="foo" validations="isFalse"/>
```

Returns true if the value is the boolean false

**isAlpha**

```jsx
<MyInput name="foo" validations="isAlpha"/>
```

Returns true if string is only letters

**isNumeric**

```jsx
<MyInput name="foo" validations="isNumeric"/>
```

Returns true if string only contains numbers. Examples: 42; -3.14

**isAlphanumeric**

```jsx
<MyInput name="foo" validations="isAlphanumeric"/>
```

Returns true if string only contains letters or numbers

**isInt**

```jsx
<MyInput name="foo" validations="isInt"/>
```

Returns true if string represents integer value. Examples: 42; -12; 0

**isFloat**

```jsx
<MyInput name="foo" validations="isFloat"/>
```

Returns true if string represents float value. Examples: 42; -3.14; 1e3

**isWords**

```jsx
<MyInput name="foo" validations="isWords"/>
```

Returns true if string is only letters, including spaces and tabs

**isSpecialWords**

```jsx
<MyInput name="foo" validations="isSpecialWords"/>
```

Returns true if string is only letters, including special letters (a-z,ú,ø,æ,å)

**equals:value**

```jsx
<MyInput name="foo" validations="equals:4"/>
```

Return true if the value from input component matches value passed (==).

**equalsField:fieldName**

```jsx
<MyInput name="password"/>
<MyInput name="repeated_password" validations="equalsField:password"/>
```

Return true if the value from input component matches value passed (==).

**isLength:length**

```jsx
<MyInput name="foo" validations="isLength:8"/>
```

Returns true if the value length is the equal.

**minLength:length**

```jsx
<MyInput name="number" validations="minLength:1"/>
```

Return true if the value is more or equal to argument.
**Also returns true for an empty value.** If you want to get false, then you should use [`required`](#required) additionally.

**maxLength:length**

```jsx
<MyInput name="number" validations="maxLength:5"/>
```

Return true if the value is less or equal to argument
