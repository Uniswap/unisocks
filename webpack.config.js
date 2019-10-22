const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

/* fix for https://medium.com/@danbruder/typeerror-require-is-not-a-function-webpack-faunadb-6e785858d23b */
// https://danbruder.com/blog/typeerror-require-is-not-a-function-webpack-faunadb/
// @see https://github.com/netlify/netlify-lambda#webpack-configuration
module.exports = {
  mode: 'development',
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false }), new Dotenv()],
  node: {
    __dirname: true
  }
}
