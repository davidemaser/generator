let webpack = require('webpack');
let HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: "./app.js",
  watch:true,
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000
  },
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module:{
    rules:[
      {
        test:/\.json$/,
        use:'json-loader'
      },
      {
        test: /\.txt$/,
        use: 'raw-loader'
      },
      {
        test: /\.gz$/,
        enforce: 'pre',
        use: 'gzip-loader'
      },
      {
        test: /\.scss$/,
        use:[
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader",
            options: {
              includePaths: ["src/scss","src/styles"],
              outputStyle: 'compressed'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin(
      {
        inject:'head',
        cache:true,
        hash:true
      }
    ),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery' })
  ]
};