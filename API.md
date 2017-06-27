# API

- [Formsy.Form](#formsyform)
  - [className](#classname)
  - [mapping](#mapping)
  - [validationErrors](#validationerrors)
  - [onSubmit()](#onsubmit)
  - [onValid()](#onvalid)
  - [onInvalid()](#oninvalid)
  - [onValidSubmit()](#onvalidsubmit)
  - [onInvalidSubmit()](#oninvalidsubmit)
  - [onChange()](#onchange)
  - [reset()](#resetform)
  - [getModel()](#getmodel)
  - [updateInputsWithError()](#updateinputswitherrorerrors)
  - [preventExternalInvalidation](#preventexternalinvalidation)
- [Formsy.Mixin](#formsymixin)
  - [name](#name)
  - [value](#value)
  - [validations](#validations)
  - [validationError](#validationerror)
  - [validationErrors](#validationerrors-1)
  - [required](#required)
  - [getValue()](#getvalue)
  - [setValue()](#setvalue)
  - [resetValue()](#resetvalue)
  - [getErrorMessage()](#geterrormessage)
  - [getErrorMessages()](#geterrormessages)
  - [isValid()](#isvalid)
  - [isValidValue()](#isvalidvalue)
  - [isRequired()](#isrequired)
  - [showRequired()](#showrequired)
  - [showError()](#showerror)
  - [isPristine()](#ispristine)
  - [isFormDisabled()](#isformdisabled)
  - [isFormSubmitted()](#isformsubmitted)
  - [validate](#validate)
  - [formNoValidate](#formnovalidate)
- [Formsy.HOC](#formsyhoc)
  - [innerRef](#innerRef)
- [Formsy.Decorator](#formsydecorator)
- [Formsy.addValidationRule](#formsyaddvalidationrule)
- [Validators](#validators)

### <a name="formsyform">Formsy.Form</a>

#### <a name="classname">className</a>
```jsx
<Formsy.Form className="my-class"></Formsy.Form>
```
Sets a class name on the form itself.

#### <a name="mapping">mapping</a>
```jsx
var MyForm = React.createClass({
  mapInputs: function (inputs) {
    return {
      'field1': inputs.foo,
      'field2': inputs.bar
    };
  },
  submit: function (model) {
    model; // {field1: '', field2: ''}
  },
  render: function () {
    return (
      <Formsy.Form onSubmit={this.submit} mapping={this.mapInputs}>
        <MyInput name="foo" value=""/>
        <MyInput name="bar" value=""/>
      </Formsy.Form>
    );
  }
})
```
Use mapping to change the data structure of your input elements. This structure is passed to the submit hooks.

#### <a name="validationerrors">validationErrors</a>
You can manually pass down errors to your form. In combination with `onChange` you are able to validate using an external validator.

```jsx
var Form = React.createClass({
  getInitialState: function () {
    return {
      validationErrors: {}
    };
  },
  validateForm: function (values) {
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
  },
  render: function () {
    return (
      <Formsy.Form onChange={this.validateForm} validationErrors={this.state.validationErrors}>
        <MyFormElement name="foo"/>
      </Formsy.Form>
    );
  }
});
```

#### <a name="onsubmit">onSubmit(data, resetForm, invalidateForm)</a>
```jsx
<Formsy.Form onSubmit={this.showFormLoader}></Formsy.Form>
```
Takes a function to run when the submit button has been clicked.

The first argument is the data of the form. The second argument will reset the form. The third argument will invalidate the form by taking an object that maps to inputs. This is useful for server side validation. E.g. `{email: "This email is taken"}`. Resetting or invalidating the form will cause **setState** to run on the form element component.

#### <a name="onvalid">onValid()</a>
```jsx
<Formsy.Form onValid={this.enableSubmitButton}></Formsy.Form>
```
Whenever the form becomes valid the "onValid" handler is called. Use it to change state of buttons or whatever your heart desires.

#### <a name="oninvalid">onInvalid()</a>
```jsx
<Formsy.Form onInvalid={this.disableSubmitButton}></Formsy.Form>
```
Whenever the form becomes invalid the "onInvalid" handler is called. Use it to for example revert "onValid" state.

#### <a name="onvalidsubmit">onValidSubmit(model, resetForm, invalidateForm)</a>
```jsx
<Formsy.Form onValidSubmit={this.sendToServer}></Formsy.Form>
```
Triggers when form is submitted with a valid state. The arguments are the same as on `onSubmit`.

#### <a name="oninvalidsubmit">onInvalidSubmit(model, resetForm, invalidateForm)</a>
```jsx
<Formsy.Form onInvalidSubmit={this.notifyFormError}></Formsy.Form>
```
Triggers when form is submitted with an invalid state. The arguments are the same as on `onSubmit`.

#### <a name="onchange">onChange(currentValues, isChanged)</a>
```jsx
<Formsy.Form onChange={this.saveCurrentValuesToLocalStorage}></Formsy.Form>
```
"onChange" triggers when setValue is called on your form elements. It is also triggered when dynamic form elements have been added to the form. The "currentValues" is an object where the key is the name of the input and the value is the current value. The second argument states if the forms initial values actually has changed.

#### <a name="resetform">reset(values)</a>
```jsx
var MyForm = React.createClass({
  resetForm: function () {
    this.refs.form.reset();
  },
  render: function () {
    return (
      <Formsy.Form ref="form">
        ...
      </Formsy.Form>
    );
  }
});
```
Manually reset the form to its pristine state. You can also pass an object that inserts new values into the inputs. Keys are name of input and value is of course the value.

#### <a name="getmodel">getModel()</a>
```jsx
var MyForm = React.createClass({
  getMyData: function () {
    alert(this.refs.form.getModel());
  },
  render: function () {
    return (
      <Formsy.Form ref="form">
        ...
      </Formsy.Form>
    );
  }
});
```
Manually get values from all registered components. Keys are name of input and value is of course the value.

#### <a name="updateInputsWithError">updateInputsWithError(errors)</a>
```jsx
var MyForm = React.createClass({
  someFunction: function () {
    this.refs.form.updateInputsWithError({
      email: 'This email is taken',
      'field[10]': 'Some error!'
    });
  },
  render: function () {
    return (
      <Formsy.Form ref="form">
        ...
      </Formsy.Form>
    );
  }
});
```
Manually invalidate the form by taking an object that maps to inputs. This is useful for server side validation. You can also use a third parameter to the [`onSubmit`](#onsubmitdata-resetform-invalidateform), [`onValidSubmit`](#onvalidsubmitmodel-resetform-invalidateform) or [`onInvalidSubmit`](#oninvalidsubmitmodel-resetform-invalidateform).

#### <a name="preventExternalInvalidation">preventExternalInvalidation</a>
```jsx
var MyForm = React.createClass({
  onSubmit: function (model, reset, invalidate) {
    invalidate({
      foo: 'Got some error'
    });
  },
  render: function () {
    return (
      <Formsy.Form onSubmit={this.onSubmit} preventExternalInvalidation>
        ...
      </Formsy.Form>
    );
  }
});
```
With the `preventExternalInvalidation` the input will not be invalidated though it has an error.

### <a name="formsymixin">Formsy.Mixin</a>

#### <a name="name">name</a>
```jsx
<MyInputComponent name="email"/>
<MyInputComponent name="address.street"/>
```
The name is required to register the form input component in the form. You can also use dot notation. This will result in the "form model" being a nested object. `{email: 'value', address: {street: 'value'}}`.

#### <a name="value">value</a>
```jsx
<MyInputComponent name="email" value="My initial value"/>
```
You should always use the [**getValue()**](#getvalue) method inside your formsy form element. To pass an initial value, use the value attribute. This value will become the "pristine" value and any reset of the form will bring back this value.

#### <a name="validations">validations</a>
```jsx
<MyInputComponent name="email" validations="isEmail"/>
<MyInputComponent name="number" validations="isNumeric,isLength:5"/>
<MyInputComponent name="number" validations={{
  isNumeric: true,
  isLength: 5
}}/>
<MyInputComponent name="number" validations={{
  myCustomIsFiveValidation: function (values, value) {
    values; // Other current values in form {foo: 'bar', 'number': 5}
    value; // 5
    return 5 === value ? true : 'No five'; // You can return an error
  }
}}/>
```
A comma separated list with validation rules. Take a look at [**Validators**](#validators) to see default rules. Use ":" to separate argument passed to the validator. The argument will go through a **JSON.parse** converting them into correct JavaScript types. Meaning:

```jsx
<MyInputComponent name="fruit" validations="isIn:['apple', 'orange']"/>
<MyInputComponent name="car" validations="mapsTo:{'bmw': true, 'vw': true}"/>
```
Works just fine.

#### <a name="validationerror">validationError</a>
```jsx
<MyInputComponent name="email" validations="isEmail" validationError="This is not an email"/>
```
The message that will show when the form input component is invalid. It will be used as a default error.

#### <a name="validationerrors">validationErrors</a>
```jsx
<MyInputComponent
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

#### <a name="required">required</a>
```jsx
<MyInputComponent name="email" validations="isEmail" validationError="This is not an email" required/>
```

A property that tells the form that the form input component value is required. By default it uses `isDefaultRequiredValue`, but you can define your own definition of what defined a required state.

```jsx
<MyInputComponent name="email" required="isFalse"/>
```
Would be typical for a checkbox type of form element that must be checked, e.g. agreeing to Terms of Service.

#### <a name="getvalue">getValue()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  render: function () {
    return (
      <input type="text" onChange={this.changeValue} value={this.getValue()}/>
    );
  }
});
```
Gets the current value of the form input component.

#### <a name="setvalue">setValue(value)</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <input type="text" onChange={this.changeValue} value={this.getValue()}/>
    );
  }
});
```
Sets the value of your form input component. Notice that it does not have to be a text input. Anything can set a value on the component. Think calendars, checkboxes, autocomplete stuff etc. Running this method will trigger a **setState()** on the component and do a render.

#### <a name="resetvalue">resetValue()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <button onClick={this.resetValue()}>Reset</button>
      </div>
    );
  }
});
```
Resets to empty value. This will run a **setState()** on the component and do a render.

#### <a name="geterrormessage">getErrorMessage()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage()}</span>
      </div>
    );
  }
});
```
Will return the validation message set if the form input component is invalid. If form input component is valid it returns **null**.

#### <a name="geterrormessages">getErrorMessages()</a>
Will return the validation messages set if the form input component is invalid. If form input component is valid it returns empty array.

#### <a name="isvalid">isValid()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var face = this.isValid() ? ':-)' : ':-(';
    return (
      <div>
        <span>{face}</span>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage()}</span>
      </div>
    );
  }
});
```
Returns the valid state of the form input component.

#### <a name="isvalidvalue">isValidValue()</a>
You can pre-verify a value against the passed validators to the form element.

```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    if (this.isValidValue(event.target.value)) {
      this.setValue(event.target.value);
    }
  },
  render: function () {
    return <input type="text" onChange={this.changeValue} value={this.getValue()}/>;
  }
});

var MyForm = React.createClass({
  render: function () {
    return (
      <Formsy.Form>
        <MyInput name="foo" validations="isEmail"/>
      </Formsy.Form>
    );
  }
});
```

#### <a name="isrequired">isRequired()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <span>{this.props.label} {this.isRequired() ? '*' : null}</span>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage()}</span>
      </div>
    );
  }
});
```
Returns true if the required property has been passed.

#### <a name="showrequired">showRequired()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var className = this.showRequired() ? 'required' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage()}</span>
      </div>
    );
  }
});
```
Lets you check if the form input component should indicate if it is a required field. This happens when the form input component value is empty and the required prop has been passed.

#### <a name="showerror">showError()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage()}</span>
      </div>
    );
  }
});
```
Lets you check if the form input component should indicate if there is an error. This happens if there is a form input component value and it is invalid or if a server error is received.

#### <a name="ispristine">isPristine()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.isPristine() ? 'You have not touched this yet' : ''}</span>
      </div>
    );
  }
});
```
By default all formsy input elements are pristine, which means they are not "touched". As soon as the [**setValue**](#setvaluevalue) method is run it will no longer be pristine.

**note!** When the form is reset, using the resetForm callback function on for example [**onSubmit**](#onsubmitdata-resetform-invalidateform) the inputs are reset to their pristine state.

#### <a name="isformdisabled">isFormDisabled()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  render: function () {
    return (
      <div>
        <input type="text" value={this.getValue()} disabled={this.isFormDisabled()}/>
      </div>
    );
  }
});

React.render(<Formy.Form disabled={true}/>);
```
You can now disable the form itself with a prop and use **isFormDisabled()** inside form elements to verify this prop.

#### <a name="isformsubmitted">isFormSubmitted()</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  render: function () {
    var error = this.isFormSubmitted() ? this.getErrorMessage() : null;
    return (
      <div>
        <input type="text" value={this.getValue()}/>
        {error}
      </div>
    );
  }
});
```
You can check if the form has been submitted.

#### <a name="validate">validate</a>
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.target.value);
  },
  validate: function () {
    return !!this.getValue();
  },
  render: function () {
    return (
      <div>
        <input type="text" value={this.getValue()} onChange={this.changeValue}/>
      </div>
    );
  }
});

React.render(<Formy.Form disabled={true}/>);
```
You can create custom validation inside a form element. The validate method defined will be run when you set new values to the form element. It will also be run when the form validates itself. This is an alternative to passing in validation rules as props.

#### <a name="formnovalidate">formNoValidate</a>
To avoid native validation behavior on inputs, use the React `formNoValidate` property.
```jsx
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  render: function () {
    return (
      <div>
        <input formNoValidate type="number"/>
      </div>
    );
  }
});
```

### <a name="formsyhoc">Formsy.HOC</a>
The same methods as the mixin are exposed to the HOC version of the element component, though through the `props`, not on the instance.
```jsx
import {HOC} from 'formsy-react';

class MyInputHoc extends React.Component {
  render() {
    return (
      <div>
        <input value={this.props.getValue()} onChange={(e) => this.props.setValue(e.target.value)}/>
      </div>
    );
  }
};
export default HOC(MyInputHoc);
```

#### <a name="innerRef">innerRef</a>

Use an `innerRef` prop to get a reference to your DOM node.

```jsx
var MyForm = React.createClass({
  componentDidMount() {
    this.searchInput.focus()
  },
  render: function () {
    return (
      <Formsy.Form>
        <MyInputHoc name="search" innerRef={(c) => { this.searchInput = c; }} />
      </Formsy.Form>
    );
  }
})
```

### <a name="formsydecorator">Formsy.Decorator</a>
The same methods as the mixin are exposed to the decorator version of the element component, though through the `props`, not on the instance.
```jsx
import {Decorator as FormsyElement} from 'formsy-react';

@FormsyElement()
class MyInput extends React.Component {
  render() {
    return (
      <div>
        <input value={this.props.getValue()} onChange={(e) => this.props.setValue(e.target.value)}/>
      </div>
    );
  }
};
export default MyInput
```

### <a name="formsyaddvalidationrule">Formsy.addValidationRule(name, ruleFunc)</a>
An example:
```jsx
Formsy.addValidationRule('isFruit', function (values, value) {
  return ['apple', 'orange', 'pear'].indexOf(value) >= 0;
});
```
```jsx
<MyInputComponent name="fruit" validations="isFruit"/>
```
Another example:
```jsx
Formsy.addValidationRule('isIn', function (values, value, array) {
  return array.indexOf(value) >= 0;
});
```
```jsx
<MyInputComponent name="fruit" validations="isIn:['apple', 'orange', 'pear']"/>
```
Cross input validation:
```jsx
Formsy.addValidationRule('isMoreThan', function (values, value, otherField) {
  // The this context points to an object containing the values
  // {childAge: "", parentAge: "5"}
  // otherField argument is from the validations rule ("childAge")
  return Number(value) > Number(values[otherField]);
});
```
```jsx
<MyInputComponent name="childAge"/>
<MyInputComponent name="parentAge" validations="isMoreThan:childAge"/>
```
## <a name="validators">Validators</a>
**matchRegexp**
```jsx
<MyInputComponent name="foo" validations={{
  matchRegexp: /foo/
}}/>
```
Returns true if the value is thruthful

_For more complicated regular expressions (emoji, international characters) you can use [xregexp](https://github.com/slevithan/xregexp). See [this comment](https://github.com/christianalfoni/formsy-react/issues/407#issuecomment-266306783) for an example._

**isEmail**
```jsx
<MyInputComponent name="foo" validations="isEmail"/>
```
Return true if it is an email

**isUrl**
```jsx
<MyInputComponent name="foo" validations="isUrl"/>
```
Return true if it is an url

**isExisty**
```jsx
<MyInputComponent name="foo" validations="isExisty"/>
```
Returns true if the value is not undefined or null

**isUndefined**
```jsx
<MyInputComponent name="foo" validations="isUndefined"/>
```
Returns true if the value is the undefined

**isEmptyString**
```jsx
<MyInputComponent name="foo" validations="isEmptyString"/>
```
Returns true if the value is an empty string

**isTrue**
```jsx
<MyInputComponent name="foo" validations="isTrue"/>
```
Returns true if the value is the boolean true

**isFalse**
```jsx
<MyInputComponent name="foo" validations="isFalse"/>
```
Returns true if the value is the boolean false

**isAlpha**
```jsx
<MyInputComponent name="foo" validations="isAlpha"/>
```
Returns true if string is only letters

**isNumeric**
```jsx
<MyInputComponent name="foo" validations="isNumeric"/>
```
Returns true if string only contains numbers. Examples: 42; -3.14

**isAlphanumeric**
```jsx
<MyInputComponent name="foo" validations="isAlphanumeric"/>
```
Returns true if string only contains letters or numbers

**isInt**
```jsx
<MyInputComponent name="foo" validations="isInt"/>
```
Returns true if string represents integer value. Examples: 42; -12; 0

**isFloat**
```jsx
<MyInputComponent name="foo" validations="isFloat"/>
```
Returns true if string represents float value. Examples: 42; -3.14; 1e3

**isWords**
```jsx
<MyInputComponent name="foo" validations="isWords"/>
```
Returns true if string is only letters, including spaces and tabs

**isSpecialWords**
```jsx
<MyInputComponent name="foo" validations="isSpecialWords"/>
```
Returns true if string is only letters, including special letters (a-z,ú,ø,æ,å)

**equals:value**
```jsx
<MyInputComponent name="foo" validations="equals:4"/>
```
Return true if the value from input component matches value passed (==).

**equalsField:fieldName**
```jsx
<MyInputComponent name="password"/>
<MyInputComponent name="repeated_password" validations="equalsField:password"/>
```
Return true if the value from input component matches value passed (==).

**isLength:length**
```jsx
<MyInputComponent name="foo" validations="isLength:8"/>
```
Returns true if the value length is the equal.

**minLength:length**
```jsx
<MyInputComponent name="number" validations="minLength:1"/>
```
Return true if the value is more or equal to argument.
**Also returns true for an empty value.** If you want to get false, then you should use [`required`](#required) additionally.

**maxLength:length**
```jsx
<MyInputComponent name="number" validations="maxLength:5"/>
```
Return true if the value is less or equal to argument
