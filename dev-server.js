/* eslint quotes: [2, "single"], no-console: 0 */

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  stats: { colors: true }
}).listen(8080, 'localhost', function(err) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8080');
});
