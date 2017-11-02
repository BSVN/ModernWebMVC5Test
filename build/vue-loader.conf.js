'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'

const loaders = utils.cssLoaders({
  sourceMap: isProduction
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap,
  extract: isProduction
});
loaders.ts = [
  {
    loader: 'ts-loader!tslint-loader',
    options: {
      formatter: 'codeFrame',
      configFile: 'tslint.json',
      emitErrors: true,
    }
  },
];

module.exports = {
  esModule: true,
  loaders: loaders,
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
