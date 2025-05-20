const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
    transpileDependencies: [
        'vuetify'
    ],
    css: {},
    configureWebpack: {
        externals: {
            // 'vue': 'Vue',
            // 'axios': 'axios'
        },
        plugins: [new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i, // 需要压缩的文件正则
            threshold: 10240, // 对超过10k的数据进行压缩
            deleteOriginalAssets: false // 是否删除原文件
        })],
        devtool: 'source-map'// debugger
    },
    pluginOptions: {
        vuetify: {}
    },
    devServer: {
        host: '0.0.0.0',
        port: 5432,
        open: true,
        allowedHosts: 'all',
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws'
        },
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        https: false,
        hot: true
    }
}