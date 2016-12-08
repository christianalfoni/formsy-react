formsy-react  [![GitHub release](https://img.shields.io/github/release/christianalfoni/formsy-react.svg)](https://github.com/christianalfoni/formsy-react/releases) [![Build Status](https://travis-ci.org/christianalfoni/formsy-react.svg?branch=master)](https://travis-ci.org/christianalfoni/formsy-react)
============

A form input builder and validator for React JS

| [How to use](#how-to-use) | [API](/API.md) | [Examples](/examples) |
|---|---|---|

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
You can look at examples in this repo or use the [formsy-react-components](https://github.com/twisty/formsy-react-components) project to use bootstrap with formsy-react, or use [formsy-material-ui](https://github.com/mbrookes/formsy-material-ui) to use [Material-UI](http://material-ui.com/) with formsy-react.

## Install

  1. Download from this REPO and use globally (Formsy) or with requirejs
  2. Install with `npm install formsy-react` and use with browserify etc.
  3. Install with `bower install formsy-react`

## Changes

[Check out releases](https://github.com/christianalfoni/formsy-react/releases)

[Older changes](CHANGES.md)

## How to use

See [`examples` folder](/examples) for examples. [Codepen demo](http://codepen.io/semigradsky/pen/dYYpwv?editors=001).

Complete API reference is available [here](/API.md).

#### Formsy gives you a form straight out of the box

```jsx
  import Formsy from 'formsy-react';

  const MyAppForm = React.createClass({
    getInitialState() {
      return {
        canSubmit: false
      }
    },
    enableButton() {
      this.setState({
        canSubmit: true
      });
    },
    disableButton() {
      this.setState({
        canSubmit: false
      });
    },
    submit(model) {
      someDep.saveEmail(model.email);
    },
    render() {
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
```jsx
  import Formsy from 'formsy-react';

  const MyOwnInput = React.createClass({

    // Add the Formsy Mixin
    mixins: [Formsy.Mixin],

    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    changeValue(event) {
      this.setValue(event.currentTarget.value);
    },

    render() {
      // Set a specific className based on the validation
      // state of this component. showRequired() is true
      // when the value is empty and the required prop is
      // passed to the input. showError() is true when the
      // value typed is invalid
      const className = this.showRequired() ? 'required' : this.showError() ? 'error' : null;

      // An error message is returned ONLY if the component is invalid
      // or the server has returned an error message
      const errorMessage = this.getErrorMessage();

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
- [formsy-material-ui](https://github.com/mbrookes/formsy-material-ui) - A formsy-react compatibility wrapper for [Material-UI](http://material-ui.com/) form components.
- [formsy-react-components](https://github.com/twisty/formsy-react-components) - A set of React JS components for use in a formsy-react form.
- ...
- Send PR for adding your project to this list!

## Contribute
- Fork repo
- `npm install`
- `npm run examples` runs the development server on `localhost:8080`
- `npm test` runs the tests

## License

[The MIT License (MIT)](/LICENSE)

Copyright (c) 2014-2016 PatientSky A/S
