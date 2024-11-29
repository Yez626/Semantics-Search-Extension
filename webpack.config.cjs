// webpack.config.js
const path = require('path');

module.exports = {
  entry: './content.js', // Replace with your content script file path
  output: {
    filename: 'content.bundle.js', // The bundled file Webpack will produce
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
};
