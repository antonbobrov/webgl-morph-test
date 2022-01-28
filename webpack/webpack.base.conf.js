const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { PATHS } = require('./paths');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {

    target: 'web',

    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },

    entry: {
        index: path.join(PATHS.src, 'ts', 'index.ts'),
    },
    output: {
        filename: NODE_ENV === 'development'
            ? 'assets/js/[name].js'
            : 'assets/js/[name].[contenthash].js',
        path: PATHS.build,
        publicPath: '/',
    },

    module: {
        rules: [

            // JavaScript
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },

            // TypeScript
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            },

            // CSS & SASS
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                config: path.resolve(__dirname, 'postcss.config.js'),
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, 'node_modules'),
                                ],
                            },
                        },
                    },
                ],
                sideEffects: true,
            },

        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: NODE_ENV === 'development'
                ? 'assets/css/[name].css'
                : 'assets/css/[name].[hash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.join(PATHS.src, 'pages', 'index.html'),
            filename: 'index.html',
            minify: true,
            inject: 'body',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.join(PATHS.public, 'static'),
                    to: '',
                },
            ],
        }),
    ],

};
