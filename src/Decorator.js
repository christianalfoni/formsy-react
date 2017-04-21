var React = global.React || require('react');

import Mixin from './Mixin.js';

export default () => (Component) => Mixin((props) => {
  return (
    <Component {...props} />
  )
})
