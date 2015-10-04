formsy-react  [![GitHub release](https://img.shields.io/github/release/christianalfoni/formsy-react.svg)](https://github.com/christianalfoni/formsy-react/releases) [![Build Status](https://travis-ci.org/christianalfoni/formsy-react.svg?branch=master)](https://travis-ci.org/christianalfoni/formsy-react)
============

A form input builder and validator for React JS

| [How to use](#how-to-use) | [API](/API.md) | [Examples](/examples) |
|---|---|---|

### Currently, the development is in 'react-0.14' branch. For more information see [#158](https://github.com/christianalfoni/formsy-react/issues/158)

### From version 0.12.0 Formsy only supports React 0.13.1 and up

## <a name="background">Background</a>
I wrote an article on forms and validation with React JS, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this extension.

The main concept is that forms, inputs and validation is done very differently across developers and projects. This extension to React JS aims to be that "sweet spot" between flexibility and reusability.

## What you can do

  1. Build any kind of form element components. Not just traditional inputs, but anything you want and get that validation for free

  2. Add validation rules and use them with simple syntax

  3. Use handlers for different states of your form. Ex. "onSubmit", "onError", "onValid" etc.

  4. Pass external errors to the form to invalidate elements

  5. You can dynamically add form elements to your form and they will register/unregister to the form

## Default elements
You can look at examples in this repo or use the [formsy-react-components](https://github.com/twisty/formsy-react-components) project to use bootstrap with formsy-react.

## Install

  1. Download from this REPO and use globally (Formsy) or with requirejs
  2. Install with `npm install formsy-react` and use with browserify etc.
  3. Install with `bower install formsy-react`

## Changes

[Check out releases](https://github.com/christianalfoni/formsy-react/releases)

[Older changes](CHANGES.md)

## How to use

See [`examples` folder](/examples) for examples.

Complete API reference is available [here](/API.md).

#### Formsy gives you a form straight out of the box

```javascript
  /** @jsx React.DOM */
  var Formsy = require('formsy-react');
  var MyAppForm = React.createClass({
    getInitialState: function () {
      return {
        canSubmit: false
      }
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
    submit: function (model) {
      someDep.saveEmail(model.email);
    },
    render: function () {
      return (
        <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
          <MyOwnInput name="email" validations="isEmail" validationError="This is not a valid email" required/>
          <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
        </Formsy.Form>
      );
    }
  });
```

This code results in a form with a submit button that will run the `submit` method when the submit button is clicked with a valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) or the value is not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

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

## Related projects
- [formsy-react-components](https://github.com/twisty/formsy-react-components) - A set of React JS components for use in a formsy-react form
- ...
- Send PR for adding your project to this list!

## Contribute
- Fork repo
- `npm install`
- `npm start` runs the development server on `localhost:8080`
- `npm test` runs the tests

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
