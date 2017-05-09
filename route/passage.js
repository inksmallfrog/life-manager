/*
* @Author: inksmallfrog
* @Date:   2017-05-09 09:33:14
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-09 11:46:31
*/

'use strict';
const Router = require('koa-router');

let passageRouter = new Router({
  prefix: '/passages'
});

passageRouter.get('/', (ctx, next)=>{
  let userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    let { Passage, Category, User } = ctx.orm('lifeManager');
    return Passage.findAll({
      include: [{
        model: Category,
        include: [{
          model: User,
          where: {
            id: userId
          },
          attributes:['id']
        }],
        attributes: ['title']
      }],
      attributes: ['title', 'src', 'state', 'createdAt'],
      order: [
        ['createdAt', 'DESC']
      ]
    }).then((passages)=>{
      ctx.body = {
        hasError: false,
        passages: passages
      }
    })
  }
})
module.exports = passageRouter;
