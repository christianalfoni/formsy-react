import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'formsy-react';

import Input from './../components/Input';

const App = React.createClass({
  getInitialState() {
    return { canSubmit: false };
  },
  submit(data) {
    alert(JSON.stringify(data, null, 4));
  },
  enableButton() {
    this.setState({ canSubmit: true });
  },
  disableButton() {
    this.setState({ canSubmit: false });
  },
  render() {
    return (
      <Form onSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} className="login">
        <Input name="email" title="Email" validations={{isEmail: true}} required />
        <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
      </Form>
    );
  }
});

ReactDOM.render(<App/>, document.getElementById('example'));
