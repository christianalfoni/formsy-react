var path = require('path');

module.exports = {

  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src', 'main.js'),
  externals: 'react',
  output: {
    path: path.resolve(__dirname, 'release'),
    filename: 'formsy-react.js',
    libraryTarget: 'umd',
    library: 'Formsy'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.json$/, use: ['json-loader'] }
    ]
  }

};
