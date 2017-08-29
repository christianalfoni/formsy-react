import React from 'react';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';

import MyInput from './../components/Input';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canSubmit: false };
    this.disableButton = this.disableButton.bind(this);
    this.enableButton = this.enableButton.bind(this);
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  render() {
    return (
      <Formsy onSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton} className="login">
        <MyInput name="email" title="Email" validations="isEmail" validationError="This is not a valid email" required />
        <MyInput name="password" title="Password" type="password" required />
        <button type="submit" disabled={!this.state.canSubmit}>Submit</button>
      </Formsy>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('example'));
