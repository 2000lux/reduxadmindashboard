const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const webpack = require('webpack')
const config = require('./config')

module.exports = Merge(CommonConfig, {
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(), // Enable HMR
    ],
    devServer: {
            hot: true, // Tell the dev-server we're using HMR
            contentBase: config.dir_dist,
            publicPath : config.compiler_public_path,
            host: config.server_host,
            port: config.server_port,
            headers: { 
                "Access-Control-Allow-Origin": "*"
            },
            proxy: {
                '/api': {
                    target: {
                        host: config.server_host,
                        protocol: 'http:',
                        port: config.server_port
                    },                
                    changeOrigin: true,
                    secure: false,
                    pathRewrite: {
                        '^/api': ''
                    }
                }
            },
            historyApiFallback: true
        } 
})
