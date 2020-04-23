const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'index': './src/index.js',
    'main': './src/main.js',
    'search': './src/search.js',
    'params': './src/params.js',
    'cards': './src/cards.js',
    'snippet': './src/snippet.js',
    'shared': 'jquery'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '../../theme.config$': path.join(__dirname, 'my-semantic-theme/theme.config'),
      "../semantic-ui/site": path.join(__dirname, "/my-semantic-theme/site")
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})
    ],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
      },

      // Semantic UI fonts and images
      {
        test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
        use: 'file-loader?name=[name].[ext]?[hash]'
      },
      // the following 3 rules handle font extraction
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.otf(\?.*)?$/,
        use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    }),
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
    new HtmlWebpackPlugin({
      chunks: ['index'],
      template: './src/privacypolicy.html',
      filename: 'privacypolicy.html'
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
        from: 'assets/videos/apollo-search.mp4', to: 'assets'
      },
      {
        from: 'assets/videos/apollo-search.webm', to: 'assets'
      }
    ])
  ]
};