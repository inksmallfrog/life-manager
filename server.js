/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:36:34
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-15 13:31:16
*/

'use strict';
const Koa = require('koa');
const Static = require('koa-static');
const ORM = require('koa-orm');
const Json = require('koa-json');
const app = new Koa();

const dbConfig = require('./config/dev.db.js');
const orm = ORM([dbConfig]);
const db = orm.database('lifeManager');

const webpack = require('webpack'),
      webpackConfig = require('./build/webpack.dev.conf'),
      compiler = webpack(webpackConfig),
      webpackDevMiddleware = require('./lib/koa-webpack-dev-middleware'),
      webpackHotMiddleware = require('./lib/koa-webpack-hot-middleware');
app.use(webpackDevMiddleware(compiler,  webpackConfig.devServer));
app.use(webpackHotMiddleware(compiler));

const keyGrip = require('keygrip');
app.keys = new keyGrip(['the best programmer in the world', 'to the one i love'], 'sha256');

const session = require('koa-session');
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  maxAge: 7200000, /** (number) maxAge in ms (default is 1 days) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
};
app.use(session(CONFIG, app));

app.use(Json());
app.use(orm.middleware);


app.use(Static(__dirname));
const userRoute = require('./route/user');
app.use(userRoute.routes());
const categoryRoute = require('./route/category');
app.use(categoryRoute.routes());
const passageRoute = require('./route/passage');
app.use(passageRoute.routes());
const commentRoute = require('./route/comment');
app.use(commentRoute.routes());
const pictureRoute = require('./route/picture');
app.use(pictureRoute.routes());


db.sync().then(()=>{
  console.log('数据库初始化完成');
  app.listen(3000);
  console.log('listening on port 3000');
});


