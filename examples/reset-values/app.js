import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'formsy-react';
import createReactClass from 'create-react-class';

import MyInput from './../components/Input';
import MySelect from './../components/Select';

const user = {
  name: 'Sam',
  free: true,
  hair: 'brown'
};

const App = createReactClass({
  submit(data) {
    alert(JSON.stringify(data, null, 4));
  },
  resetForm() {
    this.refs.form.reset();
  },
  render() {
    return (
      <Formsy.Form ref="form" onSubmit={this.submit} className="form">
        <MyInput name="name" title="Name" value={user.name} />
        <MyInput name="free" title="Free to hire" type="checkbox" value={user.free} />
        <MySelect name="hair" title="Hair" value={user.hair}
          options={[
            { value: "black", title: "Black" },
            { value: "brown", title: "Brown" },
            { value: "blonde", title: "Blonde" },
            { value: "red", title: "Red" }
          ]}
        />

        <div className="buttons">
          <button type="reset" onClick={this.resetForm}>Reset</button>
          <button type="submit">Submit</button>
        </div>
      </Formsy.Form>
    );
  }
});

ReactDOM.render(<App/>, document.getElementById('example'));
