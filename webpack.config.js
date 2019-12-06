const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: { 
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    noInfo: true,
    compress: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin()
  ],
  stats: {
    all: true,
    builtAt: true,
    errors: true,
    errorDetails: true,
    timings: true
  },
  resolve: {
    unsafeCache: true,
  },
  mode: 'development', 
  // mode: 'production',
  node: {
    fs: 'empty'
  }
}