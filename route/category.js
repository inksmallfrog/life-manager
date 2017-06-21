/*
* @Author: inksmallfrog
* @Date:   2017-05-09 11:37:43
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 08:24:02
*/

'use strict';
const Router = require('koa-router');

let categoryRouter = new Router({
  prefix: '/categories'
});

categoryRouter.get('/', (ctx, next)=>{
  const userId = ctx.request.query.userId || ctx.session.userId,
        type = ctx.request.query.type;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noUserId'
    }
  }else{
    if(type == 'passage' || type == 'photograph' || type=='todo'){
      let { Category, User } = ctx.orm('lifeManager');
      return Category.findAll({
        include: [{
          model: User,
          where: {
            id: userId
          },
          attributes:['id']
        }],
        where:{
          type: type
        },
        attributes: ['id', 'title', 'createdAt'],
        order: [
          ['createdAt', 'ASC']
        ]
      }).then((categories)=>{
        ctx.body = {
          hasError: false,
          categories: categories
        }
      })
    }else{
      //404
    }
  }
})
module.exports = categoryRouter;
