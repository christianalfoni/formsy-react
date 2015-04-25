var path = require('path');

module.exports = {

  devtool: 'inline-source-map',

  entry: path.resolve(__dirname, 'build', 'test.js'),

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'build.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.json$/, loader: 'json' }
    ]
  }

};
