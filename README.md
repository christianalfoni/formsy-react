formsy-react
============

A form input builder and validator for React JS (NOT YET RELEASED)

- [Background](#background)
- [What you can do](#whatyoucando)
- [Install](#install)
- [How to use](#howtouse)
- [API](#API)
  - [Formsy.defaults](#formsydefaults)
  - [Formsy.Form](#formsyform)
    - [className](#classname)
    - [url](#url)
    - [method](#method)
    - [contentType](#contenttype)
    - [hideSubmit](#hideSubmit)
    - [submitButtonClass](#submitButtonClass)
    - [cancelButtonClass](#cancelButtonClass)
    - [buttonWrapperClass](#buttonWrapperClass)
    - [onSuccess()](#onsuccess)
    - [onSubmit()](#onsubmit)
    - [onSubmitted()](#onsubmitted)
    - [onCancel()](#oncancel)
    - [onError()](#onerror)
  - [Formsy.Mixin](#formsymixin)
    - [name](#name)
    - [validations](#validations)
    - [validationError](#validationerror)
    - [required](#required)
    - [getValue()](#getvalue)
    - [setValue()](#setvalue)
    - [getErrorMessage()](#geterrormessage)
    - [isValid()](#isvalid)
    - [isRequired()](#isrequired)
    - [showRequired()](#showrequired)
    - [showError()](#showerror)
  - [Formsy.addValidationRule](#formsyaddvalidationrule)
- [Validators](#validators)
## <a name="background">Background</a>
I wrote an article on forms and validation with React JS, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this extension. 

The main concept is that forms, inputs and validation is done very differently across developers and projects. This extension to React JS aims to be that "sweet spot" between flexibility and reusability.

## <a name="whatyoucando">What you can do</a>

  1. Build any kind of form input components. Not just traditional inputs, but anything you want and get that validation for free

  2. Add validation rules and use them with simple syntax

  3. Use handlers for different states of your form. Ex. "onSubmit", "onError" etc. 

  4. Server validation errors automatically binds to the correct form input component

## <a name="install">Install</a>

  1. Download from this REPO and use globally (Formsy) or with requirejs
  2. Install with `npm install formsy-react` and use with browserify etc.
  3. Install with `bower install formsy-react`

## <a name="howtouse">How to use</a>

#### Formsy gives you a form straight out of the box

```javascript
  /** @jsx React.DOM */
  var Formsy = require('formsy-react');
  var MyAppForm = React.createClass({
    changeUrl: function () {
      location.href = '/success';
    },
    render: function () {
      return (
        <Formsy.Form url="/users" onSuccess={this.changeUrl}>

          <MyOwnInput name="email" validations="isEmail" validationError="This is not a valid email" required/>

        </Formsy.Form>
      );
    }
  });
```

This code results in a form with a submit button that will POST to /users when clicked. The submit button is disabled as long as the input is empty (required) or the value is not an email (isEmail). On validation error it will show the message: "This is not a valid email".

#### This is an example of what you can enjoy building
```javascript
  /** @jsx React.DOM */
  var Formsy = require('formsy-react');
  var MyOwnInput = React.createClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    // setValue() will set the value of the component, which in 
    // turn will validate it and the rest of the form
    changeValue: function (event) {
      this.setValue(event.currentTarget.value);
    },
    render: function () {

      // Set a specific className based on the validation
      // state of this component. showRequired() is true 
      // when the value is empty and the required prop is 
      // passed to the input. showError() is true when the 
      // value typed is invalid
      var className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

      // An error message is returned ONLY if the component is invalid
      // or the server has returned an error message
      var errorMessage = this.getErrorMessage();

      return (
        <div className={className}>
          <input type="text" onChange={this.changeValue} value={this.getValue()}/>
          <span>{errorMessage}</span>
        </div>
      );
    }
  });
```
So this is basically how you build your form elements. As you can see it is very flexible, you just have a small API to help you identify the state of the component and set its value.

## <a name="API">API</a>

### <a name="formsydefaults">Formsy.defaults(options)</a>
```javascript
Formsy.defaults({
  contentType: 'urlencoded', // default: 'json'
  hideSubmit: true, // default: false
  showCancel: true, // default: false
  submitButtonClass: 'btn btn-success', // default: null
  cancelButtonClass: 'btn btn-default', // default: null
  buttonWrapperClass: 'my-wrapper' // default: null
});
```
Use **defaults** to set general settings for all your forms.

### <a name="formsyform">Formsy.Form</a>

#### <a name="classname">className</a>
```html
<Formsy.Form className="my-class"></Formsy.Form>
```
Sets a class name on the form itself.

#### <a name="url">url</a>
```html
<Formsy.Form url="/users"></Formsy.Form>
```
Will either **POST** or **PUT** to the url specified when submitted.

#### <a name="method">method</a>
```html
<Formsy.Form url="/users" method="PUT"></Formsy.Form>
```
Supports **POST** (default) and **PUT**.

#### <a name="contenttype">contentType</a>
```html
<Formsy.Form url="/users" method="PUT" contentType="urlencoded"></Formsy.Form>
```
Supports **json** (default) and **urlencoded** (x-www-form-urlencoded). 

**Note!** Response has to be **json**.

#### <a name="hidesubmit">hideSubmit</a>
```html
<Formsy.Form url="/users" method="PUT" hideSubmit></Formsy.Form>
```
Hides the submit button. Submit is done by ENTER on an input.

#### <a name="submitbuttonclass">submitButtonClass</a>
```html
<Formsy.Form url="/users" method="PUT" submitButtonClass="btn btn-success"></Formsy.Form>
```
Sets a class name on the submit button.

#### <a name="cancelbuttonclass">cancelButtonClass</a>
```html
<Formsy.Form url="/users" method="PUT" cancelButtonClass="btn btn-default"></Formsy.Form>
```
Sets a class name on the cancel button.

#### <a name="buttonwrapperclass">buttonWrapperClass</a>
```html
<Formsy.Form url="/users" method="PUT" buttonWrapperClass="my-wrapper"></Formsy.Form>
```
Sets a class name on the container that wraps the **submit** and **cancel** buttons.

#### <a name="onsuccess">onSuccess(serverResponse)</a>
```html
<Formsy.Form url="/users" onSuccess={this.changeUrl}></Formsy.Form>
```
Takes a function to run when the server has responded with a success http status code.

#### <a name="onsubmit">onSubmit()</a>
```html
<Formsy.Form url="/users" onSubmit={this.showFormLoader}></Formsy.Form>
```
Takes a function to run when the submit button has been clicked. 

#### <a name="onsubmitted">onSubmitted()</a>
```html
<Formsy.Form url="/users" onSubmitted={this.hideFormLoader}></Formsy.Form>
```
Takes a function to run when either a success or error response is received from the server.

#### <a name="oncancel">onCancel()</a>
```html
<Formsy.Form url="/users" onCancel={this.goBack}></Formsy.Form>
```
Will display a "cancel" button next to submit. On click it runs the function handler.

#### <a name="onerror">onError(serverResponse)</a>
```html
<Formsy.Form url="/users" onError={this.changeToFormErrorClass}></Formsy.Form>
```
Takes a function to run when the server responds with an error http status code.

### <a name="formsymixin">Formsy.Mixin</a>

#### <a name="name">name</a>
```html
<MyInputComponent name="email"/>
```
The name is required to register the form input component in the form.

#### <a name="validations">validations</a>
```html
<MyInputComponent name="email" validations="isEmail"/>
<MyInputComponent name="number" validations="isNumeric,isLength:5:12"/>
```
An comma seperated list with validation rules. Take a look at **Validators** to see default rules. Use ":" to separate arguments passed to the validator. The arguments will go through a **JSON.parse** converting them into correct JavaScript types. Meaning:

```html
<MyInputComponent name="fruit" validations="isIn:['apple', 'orange']"/>
<MyInputComponent name="car" validations="mapsTo:{'bmw': true, 'vw': true}"/>
```
Works just fine.

#### <a name="validationerror">validationError</a>
```html
<MyInputComponent name="email" validations="isEmail" validationError="This is not an email"/>
```
The message that will show when the form input component is invalid.

#### <a name="required">required</a>
```html
<MyInputComponent name="email" validations="isEmail" validationError="This is not an email" required/>
```
A property that tells the form that the form input component value is required.

#### <a name="getvalue">getValue()</a>
```javascript
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
```javascript
var MyInput = React.createClass({
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
Sets the value of your form input component. Notice that it does not have to be a text input. Anything can set a value on the component. Think calendars, checkboxes, autocomplete stuff etc.

#### <a name="geterrormessage">getErrorMessage()</a>
```javascript
var MyInput = React.createClass({
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage}</span>
      </div>
    );
  }
});
```
Will return the server error mapped to the form input component or return the validation message set if the form input component is invalid. If no server error and form input component is valid it returns **null**.

#### <a name="isvalid">isValid()</a>
```javascript
var MyInput = React.createClass({
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var face = this.isValid() ? ':-)' : ':-(';
    return (
      <div>
        <span>{face}</span>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage}</span>
      </div>
    );
  }
});
```
Returns the valid state of the form input component.

#### <a name="isrequired">isRequired()</a>
```javascript
var MyInput = React.createClass({
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <span>{this.props.label} {this.isRequired() ? '*' : null}</span>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage}</span>
      </div>
    );
  }
});
```
Returns true if the required property has been passed. 

#### <a name="showrequired">showRequired()</a>
```javascript
var MyInput = React.createClass({
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var className = this.showRequired() ? 'required' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage}</span>
      </div>
    );
  }
});
```
Lets you check if the form input component should indicate if it is a required field. This happens when the form input component value is empty and the required prop has been passed. 

#### <a name="showerror">showError()</a>
```javascript
var MyInput = React.createClass({
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    var className = this.showRequired() ? 'required' : this.showError() ? 'error' : '';
    return (
      <div className={className}>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        <span>{this.getErrorMessage}</span>
      </div>
    );
  }
});
```
Lets you check if the form input component should indicate if there is an error. This happens if there is a form input component value and it is invalid or if a server error is received.

### <a name="formsyaddvalidationrule">Formsy.addValidationRule(name, ruleFunc)</a>
An example:
```javascript
Formsy.addValidationRule('isFruit', function (value) {
  return ['apple', 'orange', 'pear'].indexOf(value) >= 0;
});
```
```html
<MyInputComponent name="fruit" validations="'isFruit"/>
```
Another example:
```javascript
Formsy.addValidationRule('isIn', function (value, array) {
  return array.indexOf(value) >= 0;
});
```
```html
<MyInputComponent name="fruit" validations="isIn:['apple', 'orange', 'pear']"/>
```
## Validators
**isValue**
```html
<MyInputComponent name="foo" validations="isValue"/>
```
Returns true if the value is thruthful

**isEmail**
```html
<MyInputComponent name="foo" validations="isEmail"/>
```
Return true if it is an email

**isTrue**
```html
<MyInputComponent name="foo" validations="isTrue"/>
```
Returns true if the value is the boolean true

**isNumeric**
```html
<MyInputComponent name="foo" validations="isNumeric"/>
```
Returns true if string only contains numbers

**isAlpha**
```html
<MyInputComponent name="foo" validations="isAlpha"/>
```
Returns true if string is only letters

**isLength:min**, **isLength:min:max**
```html
<MyInputComponent name="foo" validations="isLength:8"/>
<MyInputComponent name="foo" validations="isLength:5:12"/>
```
Returns true if the value length is the equal or more than minimum and equal or less than maximum, if maximum is passed

**equals:value**
```html
<MyInputComponent name="foo" validations="equals:4"/>
```
Return true if the value from input component matches value passed (==).