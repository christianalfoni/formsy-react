# formsy-react [![GitHub release](https://img.shields.io/github/release/christianalfoni/formsy-react.svg)](https://github.com/christianalfoni/formsy-react/releases) [![Build Status](https://travis-ci.org/christianalfoni/formsy-react.svg?branch=master)](https://travis-ci.org/christianalfoni/formsy-react)

A form input builder and validator for React.

| [Quick Start](#quick-start) | [API](/API.md) | [Examples](/examples) |
| --------------------------- | -------------- | --------------------- |

## Background

I wrote an article on forms and validation with React, [Nailing that validation with React JS](http://christianalfoni.github.io/javascript/2014/10/22/nailing-that-validation-with-reactjs.html), the result of that was this component.

The main concept is that forms, inputs, and validation are done very differently across developers and projects. This React component aims to be that “sweet spot” between flexibility and reusability.

## What You Can Do

1.  Build any kind of form element components. Not just traditional inputs, but anything you want, and get that validation for free
2.  Add validation rules and use them with simple syntax
3.  Use handlers for different states of your form. (`onError`, `onSubmit`, `onValid`, etc.)
4.  Pass external errors to the form to invalidate elements (E.g. a response from a server)
5.  Dynamically add form elements to your form and they will register/unregister to the form

## Install

`yarn add formsy-react` and use with webpack, browserify, etc.

## Quick Start

### 1. Build a Formsy element

```jsx
// MyInput.js
import { withFormsy } from 'formsy-react';
import React from 'react';

class MyInput extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(event) {
    // setValue() will set the value of the component, which in
    // turn will validate it and the rest of the form
    // Important: Don't skip this step. This pattern is required
    // for Formsy to work.
    this.props.setValue(event.currentTarget.value);
  }

  render() {
    // An error message is returned only if the component is invalid
    const errorMessage = this.props.getErrorMessage();

    return (
      <div>
        <input
          onChange={this.changeValue}
          type="text"
          value={this.props.getValue() || ''}
        />
        <span>{errorMessage}</span>
      </div>
    );
  }
}

export default withFormsy(MyInput);
```

`withFormsy` is a [Higher-Order Component](https://facebook.github.io/react/docs/higher-order-components.html) that exposes additional props to `MyInput`. See the [API](/API.md#withFormsy) documentation to view a complete list of the props.

### 2. Use your Formsy element

```jsx
import Formsy from 'formsy-react';
import React from 'react';
import MyInput from './MyInput';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.submit = this.submit.bind(this);
    this.state = { canSubmit: false };
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  }

  enableButton = () => {
    this.setState({ canSubmit: true });
  }

  submit(model) {
    fetch('http://example.com/', {
      method: 'post',
      body: JSON.stringify(model)
    });
  }

  render() {
    return (
      <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
        <MyInput
          name="email"
          validations="isEmail"
          validationError="This is not a valid email"
          required
        />
        <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
      </Formsy.Form>
    );
  }
}
```

This code results in a form with a submit button that will run the `submit` method when the submit button is clicked with a valid email. The submit button is disabled as long as the input is empty ([required](/API.md#required)) and the value is not an email ([isEmail](/API.md#validators)). On validation error it will show the message: "This is not a valid email".

## Contribute

-   Fork repo
-   `yarn`
-   `yarn examples` runs the development server on `localhost:8080`
-   `yarn test` runs the tests

## Changelog

[Check out releases](https://github.com/christianalfoni/formsy-react/releases)

## License

[The MIT License (MIT)](/LICENSE)

Copyright (c) 2014-2016 PatientSky A/S
