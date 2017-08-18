import React from 'react';
import ReactDOM from 'react-dom';
import Formsy from 'formsy-react';

import MyCheckbox from './../components/Checkbox';
import MyInput from './../components/Input';
import MySelect from './../components/Select';

const user = {
  name: 'Sam',
  free: true,
  hair: 'brown'
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.resetForm = this.resetForm.bind(this);
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  resetForm() {
    this.form.reset();
  }

  render() {
    return (
      <Formsy ref={(c) => this.form = c} onSubmit={this.submit} className="form">
        <MyInput name="name" title="Name" value={user.name} />
        <MyCheckbox name="free" title="Free to hire" value={user.free} />
        <MySelect
          name="hair"
          title="Hair"
          value={user.hair}
          options={[
            { value: "black", title: "Black" },
            { value: "brown", title: "Brown" },
            { value: "blonde", title: "Blonde" },
            { value: "red", title: "Red" }
          ]}
        />

        <div className="buttons">
          <button type="button" onClick={this.resetForm}>Reset</button>
          <button type="submit">Submit</button>
        </div>
      </Formsy>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
