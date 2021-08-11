const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  pages: {
    // 修改文件入口文件
    index: {
      entry: 'example/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('example'),
        '~': resolve('packages/')
      }
    },
    devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined
  },
  // 扩展webpack配置，使用packages加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include.add(resolve('packages'))
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改配置项
        return options
      })
  }
}
