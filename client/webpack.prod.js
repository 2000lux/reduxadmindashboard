const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const webpack = require('webpack')

module.exports = Merge(CommonConfig, {
  devtool: 'cheap-source-map',
  plugins: [
    new webpack.LoaderOptionsPlugin({     
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        warnings: false,
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },
      comments: false
    })
  ]
})
