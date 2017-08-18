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

const randomNames = ['Christian', 'Dmitry', 'Aesop'];
const randomFree = [true, false];
const randomHair = ['brown', 'black', 'blonde', 'red'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.randomize = this.randomize.bind(this);
    this.submit = this.submit.bind(this);
  }

  randomize() {
    const random = {
      name: randomNames[Math.floor(Math.random()*randomNames.length)],
      free: randomFree[Math.floor(Math.random()*randomFree.length)],
      hair: randomHair[Math.floor(Math.random()*randomHair.length)],
    };

    this.form.reset(random);
  }

  submit(data) {
    alert(JSON.stringify(data, null, 4));
  }

  render() {
    return (
      <Formsy
        ref={(c) => this.form = c}
        onSubmit={this.submit}
        onReset={this.reset}
        className="form"
      >
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
          <button type="reset">Reset</button>
          <button type="button" onClick={this.randomize}>Randomize</button>
          <button type="submit">Submit</button>
        </div>
      </Formsy>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('example'));
