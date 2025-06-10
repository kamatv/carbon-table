const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
// const webpack = require("webpack");


const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    clean: true
  },
  mode: "development",
  module:{
    rules: [{
        // We load JS files through Babel to get all the ES2016+ goodies.
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"]
          }
        }
    },{
      test: /\.scss$/i,
      use: [
        "style-loader",
        "css-loader",
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            sassOptions: {
              quietDeps: true,
              includePaths: ['node_modules'],
            },
          },
        },
      ],
    },{
      test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
      type: "asset/resource"
    },{
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "asset/resource"
    }
  ]},
  resolve:{
    extensions: [".js", ".jsx"]
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname,"utils/index.html"),
  })],
  devServer: {
    port: 3001,
    hot: true,
    static: './public'
  }
};

module.exports = config;
