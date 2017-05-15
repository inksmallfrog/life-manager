/*
* @Author: inksmallfrog
* @Date:   2017-05-15 08:15:07
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-15 08:15:20
* from https://github.com/leecade/koa-webpack-middleware for no babel
*/

'use strict';
const devMiddleware = require('webpack-dev-middleware');
const expressMiddleware = require('webpack-dev-middleware');

module.exports = (compiler, opts) => {
  const expressMiddleware = devMiddleware(compiler, opts)
  return async (ctx, next) => {
    await expressMiddleware(ctx.req, {
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    }, next)
  }
}
