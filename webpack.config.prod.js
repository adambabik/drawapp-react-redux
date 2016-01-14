/* eslint quotes: [2, "single"] */

var path = require('path');
var webpack = require('webpack');
var baseConfig = require('./webpack.config');

module.exports = {
  devtool: '#source-map',
  entry: [
    './app/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    sourceMapFilename: 'app.js.map'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      mangle: false
    })
  ],
  module: baseConfig.module
};
