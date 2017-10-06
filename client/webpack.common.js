const path = require('path');
const webpack = require('webpack')
const config = require('./config')
const debug = require('debug')('app:config')
const fs = require('fs-extra')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

debug('Copying static assets to dist folder.')
fs.copySync(config.dir_static, config.dir_dist)

module.exports = {
    entry: {
        app: config.dir_client + '/main.js',      
        vendor: config.compiler_vendors
    },
    output: {
        path: path.resolve(config.dir_dist),
        filename: '[name].bundle.js',
        publicPath : config.compiler_public_path
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            Commons: path.resolve(__dirname, 'src/Commons/'),
            Config: path.resolve(__dirname, 'src/config/'),
            Contacts: path.resolve(__dirname, 'src/Contacts/'),
            Enterprises: path.resolve(__dirname, 'src/Enterprises/'),
            FlashMessages: path.resolve(__dirname, 'src/FlashMessages/'),
            Interactions: path.resolve(__dirname, 'src/Interactions/'),
            Layout: path.resolve(__dirname, 'src/Layout/'),
            Products: path.resolve(__dirname, 'src/Products/'),
            Providers: path.resolve(__dirname, 'src/Providers/'),
            Sales: path.resolve(__dirname, 'src/Sales/'),
            Sectors: path.resolve(__dirname, 'src/Sectors/'),
            Session: path.resolve(__dirname, 'src/Session/'),
            Tasks: path.resolve(__dirname, 'src/Tasks/'),
            Users: path.resolve(__dirname, 'src/Users/')
        }
    },
    plugins: [
        // new webpack.NoEmitOnErrorsPlugin()    
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new HtmlWebpackPlugin({
            template : config.dir_client + '/index.html',
            hash     : false,
            favicon  : config.dir_static + '/favicon.ico',
            filename : 'index.html',
            inject   : 'body',
            minify   : {
                collapseWhitespace : true
            }
        }),
        new ExtractTextPlugin({ // define where to save the file
            filename: '[name].bundle.css',
            allChunks: true
        })
    ], 
    module: {
        rules: [   
            {
                test    : /\.(js|jsx)$/,
                exclude : /node_modules/,
                loader  : 'babel-loader',
                query   : config.compiler_babel
            }, {
                test   : /\.json$/,
                loader : 'json-loader'
            },
            {   // regular css files
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader?importLoaders=1'
                })
            },
            {   // sass / scss loader for webpack
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                'file-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]      
    }
}
