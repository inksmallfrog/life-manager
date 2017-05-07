/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:36:34
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 18:50:12
*/

'use strict';
const Koa = require('koa');
const Static = require('koa-static');
const ORM = require('koa-orm');
const Json = require('koa-json');
const koaBody = require('koa-body');
const app = new Koa();

const dbConfig = require('./config/dev.db.js');
const orm = ORM([dbConfig]);
const db = orm.database('lifeManager');

app.use(koaBody());
app.use(Json());
app.use(orm.middleware);
const userRoute = require('./route/user');
app.use(userRoute.routes());

db.sync({force:true,  logging: console.log}).then(()=>{
  console.log('数据库初始化完成');
  app.listen(3000);
  console.log('listening on port 3000');
});


