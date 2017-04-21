import React from 'react'
import Formsy from './../..'

class TestInput extends React.Component {
  methodOnWrappedInstance (param) {
    return param
  }

  render () {
    return <input {...this.props} />
  }
}

export default Formsy.HOC(TestInput)
