/*
* @Author: inksmallfrog
* @Date:   2017-05-12 11:17:54
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 11:25:50
*/

'use strict';
const Router = require('koa-router');

let commentRouter = new Router({
  prefix: '/comments'
});

const koaBody = require('koa-body');
let commentBody = koaBody({
  multipart: true
});

commentRouter.post('/', commentBody, (ctx, next)=>{
  const passageId = ctx.request.query.passageId,
        { content } = ctx.request.body.fields,
        userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const { Comment, Passage, User } = ctx.orm('lifeManager');
    return Comment.create({
      commenterId: userId,
      passageId: passageId,
      content: content
    }).then((comment)=>{
      ctx.body = {
        hasError: false,
        comments: comment
      }
    })
  }
});

module.exports = commentRouter;
