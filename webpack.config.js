const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./client/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx"],
    alias: {
      "@app": path.resolve(__dirname, "client/1-app"),
      "@pages": path.resolve(__dirname, "client/2-pages"),
      "@widgets": path.resolve(__dirname, "client/3-widgets"),
      "@features": path.resolve(__dirname, "client/4-features"),
      "@shared": path.resolve(__dirname, "client/5-shared"),
      "@images": path.resolve(__dirname, "client/images"),
      "@root": path.resolve(__dirname),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url если нам нужен src для img , или мы делаем прямой импорт в файл (ex import 'client/img/tip-leg.svg?url')
        type: "asset/resource",
        generator: { filename: "static/[name][ext]" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/index.html",
      title: "LogicLike App",
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:4444",
        changeOrigin: true,
      },
    },
  },
  devtool: "source-map",
};
