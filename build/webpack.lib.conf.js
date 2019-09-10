var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var fs = require('fs')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')

const UglifyJsPlugin = require('terser-webpack-plugin');

function getFilename(ext, minimize) {
  return '[name]' + (minimize ? '.min' : '') + ext
}
module.exports = function(options) {
	//console.log('Called with minimized = ',options.minimize,++i);
  if (options.components) {
    var root = './src/components'
    baseWebpackConfig.entry = {
      'components/index': [`${root}/index`]
    }
    var files = fs.readdirSync(root)
    files.forEach(component => {
      if (fs.statSync(path.join(root, component)).isDirectory()) {
        var entryKey = `components/${component}/index`
        var entryValue = `${root}/${component}/index`
        baseWebpackConfig.entry[entryKey] = [entryValue]
      }
    })
  } else {
    baseWebpackConfig.entry = {
      [config.lib.filename]: './src/index.js'
    }
  }

  var webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
	optimization: {
			minimize: false,
	},
	performance: {
		maxEntrypointSize: 1512000,
		maxAssetSize: 1512000
	},
    externals: {
      vue: {
        commonjs: 'vue',
        commonjs2: 'vue',
        amd: 'vue',
        root: 'Vue'
      }
    },
    output: {
      path: config.lib.assetsRoot,
      filename: utils.assetsLibPath(getFilename('.js', options.minimize)),
      library: config.lib.name,
      libraryTarget: 'umd'
    },
    plugins: [
      // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        'process.env': config.lib.env
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  })
  if (options.minimize) {
	  webpackConfig.optimization = {
		  minimize: true,
			minimizer: [new UglifyJsPlugin({
				sourceMap: false
			})]
	  };
    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin()
    )
  }

  if (options.components) {
    delete webpackConfig.output.library
    webpackConfig.output.filename = utils.assetsLibPath(getFilename('.js', false))
  }

  if (config.lib.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          config.lib.productionGzipExtensions.join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    )
  }
  return webpackConfig;
}
