const path = require("path");
const webpack = require("webpack");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const GitRevision = new GitRevisionPlugin();
const buildDate = JSON.stringify(new Date().toLocaleString());
const antdTheme = require("./src/theme.js");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === "production";

const assetsCDN = {
  // webpack build externals
  externals: {
    Vue: "Vue",
    VueRouter: "VueRouter",
    Vuex: "Vuex",
    Axios: "axios"
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    "//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js",
    "//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js",
    "//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js",
    "//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js"
  ]
};

module.exports = {
  lintOnSave: true,
  devServer: {
    disableHostCheck: true
  },
  // disable source map in production
  productionSourceMap: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: [],
  configureWebpack: {
    performance: {
      hints: false
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        APP_VERSION: `"${require("./package.json").version}"`,
        GIT_HASH: JSON.stringify(GitRevision.version()),
        BUILD_DATE: buildDate
      })
    ],
    // if prod, add externals
    externals: isProd ? assetsCDN.externals : {}
    // optimization: {
    //   splitChunks: '{
    //     minSize: 50000,
    //     maxSize: 250000
    //   }'
    // }
  },
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.resolve.alias.set("@$", resolve("src"));

    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .oneOf("inline")
      .resourceQuery(/inline/)
      .use("vue-svg-icon-loader")
      .loader("vue-svg-icon-loader")
      .end()
      .end()
      .oneOf("external")
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/[name].[hash:8].[ext]"
      });

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

    // if prod is on
    // assets require on cdn
    if (isProd) {
      config.plugin("html").tap(args => {
        args[0].cdn = assetsCDN;
        return args;
      });
    }
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
