/*
* @Author: inksmallfrog
* @Date:   2017-05-08 06:52:42
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-08 06:58:33
*/

'use strict';
const Router = require('koa-router');

const Vue = require('vue');
const vue_router = require('./src/router');
const App = require('./src/App.vue');
const renderer = require('vue-server-renderer').createRenderer()

let homeRouter = new Router({
  prefix: '/'
});
homeRouter.get('/', (ctx, next)=>{
  const component = new Vue({
    el: '#app',
    vue_router,
    template: '<App/>',
    components: { App },
  });
  return new Promise((resolve, reject)=>{
    renderer.renderToString(app, (err, html)=>{
      if(err){
        reject(err);
      }
      else{
        ctx.body = html;
        resolve(html);
      }
    })
  })
});
