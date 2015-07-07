var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'source-map',

  entry: path.resolve(__dirname, 'src', 'main.js'),

  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],

  output: {
    path: path.resolve(__dirname, 'release'),
    filename: 'formsy-react.js',
    libraryTarget: 'umd',
    library: 'Formsy'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?loose=all' }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ]

};
