/*
* @Author: inksmallfrog
* @Date:   2017-05-15 08:13:58
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-15 08:14:42
* from https://github.com/leecade/koa-webpack-middleware for no babel
*/

'use strict';
const hotMiddleware = require('webpack-hot-middleware');
const { PassThrough } = require('stream');

module.exports = (compiler, opts) => {
  const expressMiddleware = hotMiddleware(compiler, opts)
  return async (ctx, next) => {
    let stream = new PassThrough()
    ctx.body = stream
    await expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status
        ctx.set(headers)
      }
    }, next)
  }
}
