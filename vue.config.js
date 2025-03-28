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
        port: 5432,
        open: true,
    }
}