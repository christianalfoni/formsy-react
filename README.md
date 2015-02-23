formsy-react
============

A form input builder and validator for React JS

- [Background](#background)
- [What you can do](#whatyoucando)
- [Install](#install)
- [Changes](#changes)
- [How to use](#howtouse)
- [API](#API)
  - [Formsy.defaults](#formsydefaults)
  - [Formsy.Form](#formsyform)
    - [className](#classname)
    - [url](#url)
    - [method](#method)
    - [contentType](#contenttype)
    - [mapping](#mapping)
    - [onSuccess()](#onsuccess)
    - [onSubmit()](#onsubmit)
    - [onSubmitted()](#onsubmitted)
    - [onError()](#onerror)
    - [onValid()](#onvalid)
    - [onInvalid()](#oninvalid)
    - [onChange()](#onchange)
  - [Formsy.Mixin](#formsymixin)
    - [name](#name)
    - [value](#value)
    - [validations](#validations)
    - [validationError](#validationerror)
    - [required](#required)
    - [getValue()](#getvalue)
    - [setValue()](#setvalue)
    - [hasValue()](#hasvalue)
    - [resetValue()](#resetvalue)
    - [getErrorMessage()](#geterrormessage)
    - [isValid()](#isvalid)
    - [isRequired()](#isrequired)
    - [showRequired()](#showrequired)
    - [showError()](#showerror)
    - [isPristine()](#ispristine)
  - [Formsy.addValidationRule](#formsyaddvalidationrule)
- [Validators](#validators)


## <a name="background">Background</a>
I wrote an article on forms and validation with React JS, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this extension. 

The main concept is that forms, inputs and validation is done very differently across developers and projects. This extension to React JS aims to be that "sweet spot" between flexibility and reusability.

## <a name="whatyoucando">What you can do</a>

  1. Build any kind of form element components. Not just traditional inputs, but anything you want and get that validation for free

  2. Add validation rules and use them with simple syntax

  3. Use handlers for different states of your form. Ex. "onSubmit", "onError", "onValid" etc. 

  4. Server validation errors automatically binds to the correct form input component

  5. You can dynamically add form elements to your form and they will register/unregister to the form

## <a name="install">Install</a>

  1. Download from this REPO and use globally (Formsy) or with requirejs
  2. Install with `npm install formsy-react` and use with browserify etc.
  3. Install with `bower install formsy-react`

## <a name="changes">Changes</a>

**0.7.1**
  - Fixed bug where external update of value on pristine form element did not update the form model (Thanks @sdemjanenko)
  - Fixed bug where children are null/undefined (Thanks @sdemjanenko)

**0.7.0**
  - Dynamic form elements. Add them at any point and they will be registered with the form
  - **onChange()** handler is called whenever an form element has changed its value or a new form element is added to the form
  - isNumeric validator now also handles actual numbers, not only strings
  - Some more tests

**0.6.0**
  - **onSubmit()** now has the same signature regardless of passing url attribute or not
  - **isPristine()** is a new method to handle "touched" form elements (thanks @FoxxMD)
  - Mapping attributes to pass a function that maps input values to new structure. The new structure is either passed to *onSubmit* and/or to the server when using a url attribute (thanks for feedback @MattAitchison)
  - Added default "equalsField" validation rule
  - Lots of tests!

**0.5.2**
  - Fixed bug with handlers in ajax requests (Thanks @smokku)

**0.5.1**
  - Fixed bug with empty validations
  
**0.5.0**
  - Added [cross input validation](#formsyaddvalidationrule)
  - Fixed bug where validation rule refers to a string
  - Added "invalidateForm" function when manually submitting the form

[Older changes](CHANGES.md)

## <a name="howtouse">How to use</a>

#### Formsy gives you a form straight out of the box

```javascript
  /** @jsx React.DOM */
  var Formsy = require('formsy-react');
  var MyAppForm = React.createClass({
    changeUrl: function () {
      location.href = '/success';
    },
    enableButton: function () {
      this.setState({
        canSubmit: true
      });
    },
    disableButton: function () {
      this.setState({
        canSubmit: false
      });
    },
    render: function () {
      return (
        <Formsy.Form url="/users" onSuccess={this.changeUrl} onValid={this.enableButton} onInvalid={this.disableButton}>
          <MyOwnInput name="email" validations="isEmail" validationError="This is not a valid email" required/>
          <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
        </Formsy.Form>
      );
    }
  });
```

This code results in a form with a submit button that will POST to /users when clicked. The submit button is disabled as long as the input is empty (required) or the value is not an email (isEmail). On validation error it will show the message: "This is not a valid email".

#### Building a form element (required)
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
The form element component is what gives the form validation functionality to whatever you want to put inside this wrapper. You do not have to use traditional inputs, it can be anything you want and the value of the form element can also be anything you want. As you can see it is very flexible, you just have a small API to help you identify the state of the component and set its value.

## <a name="API">API</a>

### <a name="formsydefaults">Formsy.defaults(options)</a>
```javascript
Formsy.defaults({
  contentType: 'urlencoded', // default: 'json'
  headers: {} // default headers
  /* DEPRECATED
  hideSubmit: true, // default: false
  submitButtonClass: 'btn btn-success', // default: null
  cancelButtonClass: 'btn btn-default', // default: null
  buttonWrapperClass: 'my-wrapper' // default: null
  */
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
Will either **POST** or **PUT** to the url specified when submitted. If you do not pass a url the data for the form will be passed to the **onSubmit** handler.

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

#### <a name="mapping">mapping</a>
```javascript
var MyForm = React.createClass({
  mapInputs: function (inputs) {
    return {
      'field1': inputs.foo,
      'field2': inputs.bar
    };
  },
  render: function () {
    return (
      <Formsy.Form url="/users" mapping={this.mapInputs}>
        <MyInput name="foo"/>
        <MyInput name="bar"/>
      </Formsy.Form>
    );
  }
})
```
Use mapping to change the data structure of your input elements. This structure is passed to the onSubmit handler and/or to the server on submitting, depending on how you submit the form.

#### <a name="onsuccess">onSuccess(serverResponse)</a>
```html
<Formsy.Form url="/users" onSuccess={this.changeUrl}></Formsy.Form>
```
Takes a function to run when the server has responded with a success http status code.

#### <a name="onsubmit">onSubmit(data, resetForm, invalidateForm)</a>
```html
<Formsy.Form url="/users" onSubmit={this.showFormLoader}></Formsy.Form>
```
Takes a function to run when the submit button has been clicked. 

The first argument is the data of the form. The second argument will reset the form. The third argument will invalidate the form by taking an object that maps to inputs. E.g. `{email: "This email is taken"}`. Resetting or invalidating the form will cause **setState** to run on the form element component.

**note!** If you do not pass a url attribute this handler is where you would manually do your ajax request.

#### <a name="onsubmitted">onSubmitted()</a>
```html
<Formsy.Form url="/users" onSubmitted={this.hideFormLoader}></Formsy.Form>
```
Takes a function to run when either a success or error response is received from the server.

#### <a name="onerror">onError(serverResponse)</a>
```html
<Formsy.Form url="/users" onError={this.changeToFormErrorClass}></Formsy.Form>
```
Takes a function to run when the server responds with an error http status code.

#### <a name="onvalid">onValid()</a>
```html
<Formsy.Form url="/users" onValid={this.enableSubmitButton}></Formsy.Form>
```
Whenever the form becomes valid the "onValid" handler is called. Use it to change state of buttons or whatever your heart desires.

#### <a name="oninvalid">onInvalid()</a>
```html
<Formsy.Form url="/users" onInvalid={this.disableSubmitButton}></Formsy.Form>
```
Whenever the form becomes invalid the "onInvalid" handler is called. Use it to for example revert "onValid" state.

#### <a name="onchange">onChange(currentValues)</a>
```html
<Formsy.Form url="/users" onChange={this.saveCurrentValuesToLocalStorage}></Formsy.Form>
```
"onChange" triggers when setValue is called on your form elements. It is also triggered when dynamic form elements have been added to the form. The "currentValues" is an object where the key is the name of the input and the value is the current value.

### <a name="formsymixin">Formsy.Mixin</a>

#### <a name="name">name</a>
```html
<MyInputComponent name="email"/>
```
The name is required to register the form input component in the form.

#### <a name="value">value</a>
```html
<MyInputComponent name="email" value="My default value"/>
```
You should always use the **getValue()** method inside your formsy form element. To pass a default value, use the value attribute.

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

#### <a name="hasvalue">hasValue()</a>
```javascript
var MyInput = React.createClass({
  mixins: [Formsy.Mixin],
  changeValue: function (event) {
    this.setValue(event.currentTarget.value);
  },
  render: function () {
    return (
      <div>
        <input type="text" onChange={this.changeValue} value={this.getValue()}/>
        {this.hasValue() ? 'There is a value here' : 'No value entered yet'}
      </div>
    );
  }
});
```
The hasValue() method helps you identify if there actually is a value or not. The only invalid value in Formsy is an empty string, "". All other values are valid as they could be something you want to send to the server. F.ex. the number zero (0), or false.

#### <a name="resetvalue">resetValue()</a>
```javascript
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
```javascript
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
Will return the server error mapped to the form input component or return the validation message set if the form input component is invalid. If no server error and form input component is valid it returns **null**.

#### <a name="isvalid">isValid()</a>
```javascript
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

#### <a name="isrequired">isRequired()</a>
```javascript
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
```javascript
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
```javascript
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
```javascript
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
By default all formsy input elements are pristine, which means they are not "touched". As soon as the **setValue** method is run it will no longer be pristine.

**note!** When the form is reset, using the resetForm callback function on **onSubmit** the inputs are not reset to pristine.


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
Cross input validation:
```javascript
Formsy.addValidationRule('isMoreThan', function (value, otherField) {
  // The this context points to an object containing the values
  // {childAge: "", parentAge: "5"}
  // otherField argument is from the validations rule ("childAge")
  return Number(value) > Number(this[otherField]);
});
```
```html
<MyInputComponent name="childAge"/>
<MyInputComponent name="parentAge" validations="isMoreThan:childAge"/>
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

**isWords**
```html
<MyInputComponent name="foo" validations="isWords"/>
```
Returns true if string is only letters, including spaces and tabs

**isSpecialWords**
```html
<MyInputComponent name="foo" validations="isSpecialWords"/>
```
Returns true if string is only letters, including special letters (a-z,ú,ø,æ,å)

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

**equalsField:fieldName**
```html
<MyInputComponent name="password"/>
<MyInputComponent name="repeated_password" validations="equalsField:password"/>
```
Return true if the value from input component matches value passed (==).

## Run tests
- Run `gulp`
- Run a server in `build` folder
- Go to `localhost/testrunner.html` (live reload)

License
-------

formsy-react is licensed under the [MIT license](LICENSE).

> The MIT License (MIT)
>
> Copyright (c) 2015 Gloppens EDB Lag
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
