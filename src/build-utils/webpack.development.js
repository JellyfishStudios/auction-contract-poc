const webpack = require("webpack");

module.exports = {
  devtool: 'inline-source-map',

  devServer: {
    contentBase: './dist',
    hot: true
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin({
      test: [/\.js$/, /\.jsx$/],
      filename: '[file].map',
      exclude: 'vendor'
    })
  ]
};