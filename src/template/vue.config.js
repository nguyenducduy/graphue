const webpack = require("webpack");
const antdTheme = require("./src/theme.js");

module.exports = {
  lintOnSave: true,
  devServer: {
    disableHostCheck: true
  },
  configureWebpack: {
    performance: {
      hints: false
    },
    plugins: [],
    optimization: {
      splitChunks: {
        minSize: 50000,
        maxSize: 250000
      }
    }
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");

    config.module
      .rule("tsx")
      .test(/\.tsx$/)
      .use("vue-jsx-hot-loader")
      .before("babel-loader")
      .loader("vue-jsx-hot-loader");
    config.plugin("html").tap(args => {
      args[0].chunksSortMode = "none";
      return args;
    });
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: antdTheme,
          javascriptEnabled: true
        }
      }
    }
  }
};
