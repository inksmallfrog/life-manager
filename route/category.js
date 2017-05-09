/*
* @Author: inksmallfrog
* @Date:   2017-05-09 11:37:43
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-09 11:53:05
*/

'use strict';
const Router = require('koa-router');

let categoryRouter = new Router({
  prefix: '/categories'
});

categoryRouter.get('/', (ctx, next)=>{
  let userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const type = ctx.request.query.type;
    if(type == 'passage' || type == 'photograph'){
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
