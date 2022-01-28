const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {

    mode: 'development',

    devtool: 'eval-source-map',

    watchOptions: {
        aggregateTimeout: 100,
    },

    devServer: {
        open: true,
        compress: true,
        port: 8080,
        client: {
            overlay: {
                warnings: true,
                errors: true,
            },
        },
        hot: false,
        liveReload: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },

});
