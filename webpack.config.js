const path = require("path");
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpackMerge = require('webpack-merge');
const modeConfig = (mode) => require(`./src/build-utils/webpack.${mode}.js`);
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env, argv) => {
  return webpackMerge({

    mode: argv.mode,

    entry: path.resolve(__dirname, 'src', 'index.js'),

    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader"
        },
        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        {
          test: /\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                  require('postcss-flexbugs-fixes'),
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
      ]
    },

    resolve: { extensions: ["*", ".js", ".jsx"] },

    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: "/"
    },

    optimization: {
      splitChunks: {
          chunks: 'all'
      }
    },

    plugins: [
      new MiniCssExtractPlugin(),
      
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
      }),

      new CopyWebpackPlugin(
        [
          { from: 'src/images', to: 'images/' }, 
          'src/manifest.json',
        ],
        { ignore: ['.DS_Store'] }
      ),

      new WorkboxWebpackPlugin.GenerateSW({
        skipWaiting: true,
        clientsClaim: true
      })
    ],

  }, modeConfig(argv.mode))
}