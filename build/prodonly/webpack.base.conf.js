var path = require('path')
var utils = require('./utils')
var config = require('../../config')
const { VueLoaderPlugin } = require('vue-loader');
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@components': resolve('src/components'),
      '@utils': resolve('src/utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
		use:{
			loader: 'vue-loader'
		}
      },
      {
        test: /\.js$/,
        use:{
			loader: 'babel-loader'
		},
		include: [resolve('src')]
	  },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
		use:{
			loader: 'url-loader',
			options: {
			  limit: 10000,
			  name: utils.assetsPath('img/[name].[hash:7].[ext]')
			}
		}
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use:{
			loader: 'url-loader',
			options: {
			  limit: 10000,
			  name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
			}
		}
      }
    ]
  },
	plugins: [
		new VueLoaderPlugin()
	]
}
