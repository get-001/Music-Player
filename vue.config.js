// 更改了配置文件要重新编译打包
// webpack用的是node环境，不能使用import，要用require
const webpack = require("webpack");
const path = require("path");

module.exports = {
  // productionSourceMap -- 是否打包map文件(映射文件，作用是调试时会显示错误在第几行。上线后用不着)
  productionSourceMap: false,

  // outputDir -- 设置输出目录 默认(dist)、
  outputDir: "./myDist",

  // publicPath -- 设置资源目录 (开发环境'/'、生产环境'./')
  // process.env.NODE_ENV 可以判断是否为生产环境
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",

  // assetsDir -- 配置资源存放的位置(js、css、img)
  assetsDir: "src",

  // chainWebpack -- 给路径配置别名
  chainWebpack: config => {
    config.resolve.alias.set("@v", path.resolve(__dirname, "src/views"));
  },

  // ------------------------------------------------------------------------------------------

  // devServer -- 设置axios代理(axios插件)
  devServer: {
    // 设置接口
    proxy: {
      // 这样配置就可以在开发环境下跨域了
      "/Music-Player/api.php": {
        target: "http://a-1.vip", //目标接口域名
        changeOrigin: true, //是否跨域
        secure: false // 允许https请求
      }
    }
  },

  //configureWebpack 是Vue CLI3.0 中用于配置 webpack 插件参数的地方，你在这里设置，会新建或者覆盖 webpack 默认配置。
  //webpack ProvidePlugin 的含义是创建一个全局的变量，使这个变量在 webpack 各个模块内都可以使用。这里的配置含义是创建 '$'、'jQuery'、'window.jQuery' 三个变量指向 jquery 依赖，创建 'Popper' 变量指向 popper.js 依赖。
  configureWebpack: {
    // 在这里面就像写真正的webpack一样，来配置
    // plugins -- 插件
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        Popper: ["popper.js", "default"]
      })
    ]
    // module -- 模块
    // module: {}
  },

  // 将less样式注入到全局、
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        // 要全局引入的样式文件
        path.resolve(__dirname, "src/xxx.less")
      ]
    }
  }
};
