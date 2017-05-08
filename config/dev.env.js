var prodEnv = require('./prod.env')
var merge = require('webpack-merge');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
