const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    'index': './src/index.js',
    'main': './src/main.js',
    'search': './src/search.js',
    'params': './src/params.js',
    'cards': './src/cards.js',
    'snippet': './src/snippet.js',
    'shared': 'jquery'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },

      // Semantic UI fonts and images
      {test:/\.svg$/,loader:'url-loader',query:{mimetype:'image/svg+xml',name:'./public/css/semantic/themes/default/assets/fonts/icons.svg'}},

      {test:/\.png$/,loader:'url-loader',query:{mimetype:'image/png',name:'./public/css/semantic/themes/default/assets/images/flags.png'}},
   
      {test:/\.woff$/,loader:'url-loader',query:{mimetype:'application/font-woff',name:'./public/css/semantic/themes/default/assets/fonts/icons.woff'}},
              
      {test:/\.woff2$/,loader:'url-loader',query:{mimetype:'application/font-woff2',name:'./public/css/semantic/themes/default/assets/fonts/icons.woff2'}},
              
      {test:/\.[ot]tf$/,loader:'url-loader',query:{mimetype:'application/octet-stream',name:'./public/css/semantic/themes/default/assets/fonts/icons.ttf'}},   

      {test:/\.eot$/,loader:'url-loader',query:{mimetype:'application/vnd.ms-fontobject',name:'./public/css/semantic/themes/default/assets/fonts/icons.eot'}}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      chunks: ['index'],
      template: './src/index.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './src/search/search.html',
      filename: 'search/search.html'
    }),
    new HtmlWebpackPlugin({
      chunks: ['params', 'search', 'cards', 'snippet'],
      template: './src/search/snippet.html',
      filename: 'search/snippet.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from:'assets/images/rocket.svg', to: 'assets'
      },
      {
        from: 'assets/images/jason-porter.jpg', to: 'assets'
      },
      {
        from: 'assets/images/apollo-gif.gif', to: 'assets'
      }
    ])
  ]
};