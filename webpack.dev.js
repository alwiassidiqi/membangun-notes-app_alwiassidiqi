const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    static: {
      directory: common.output.path,
    },
    open: true,
    hot: true,
    port: 9000,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
});
