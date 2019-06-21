var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var fs = require('fs')
var config = require('../../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeJsPlugin = require('optimize-js-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//var i = 0;


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
    module: {
      rules: utils.styleLoaders({
        sourceMap: false,
        extract: true,
        minimize: options.minimize
      })
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
      // extract css into its own file
      new ExtractTextPlugin({
        filename: utils.assetsLibPath(getFilename('.css', options.minimize))
      }),
      new webpack.optimize.ModuleConcatenationPlugin()
    ]
  })
  if (options.minimize) {
	  webpackConfig.optimization = {
		  minimize: true,
			minimizer: [new UglifyJsPlugin({
				uglifyOptions: {
				  warnings: false
				  
				},
				sourceMap: false
			})]
	  };
    webpackConfig.plugins.push(
      new OptimizeJsPlugin({
        sourceMap: false
      })
    )
    webpackConfig.plugins.push(
      new webpack.optimize.OccurrenceOrderPlugin()
    )
    webpackConfig.plugins.push(
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true
        }
      })
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
