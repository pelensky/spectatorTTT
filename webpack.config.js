const path = require('path')
const Dotenv = require('dotenv-webpack');

const config = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
           { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  plugins: [
    new Dotenv({
      path: '.env',
      safe: true,
      systemvars: true
    })
  ]
}

module.exports = config
