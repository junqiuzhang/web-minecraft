const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.ts',
  output: { 
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    disableHostCheck: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: {
          loader: 'ts-loader',
          options: {}
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin()
  ],
  stats: {
    all: false,
    errors: true,
    errorDetails: true,
    timings: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    unsafeCache: true,
  },
  mode: 'development', 
}