/*
* @Author: inksmallfrog
* @Date:   2017-05-07 18:05:11
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 19:16:01
*/

'use strict';
const Router = require('koa-router');

let userRouter = new Router({
  prefix: '/users'
});

userRouter.post('/', async (ctx, next)=>{
  console.log(ctx.request.body);
  const {email, psd} = ctx.request.body;
  console.log(email);
  if(!email || !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
    ctx.body = {
      'status': 'error',
      'param': 'email'
    };
  }
  else if(!psd || psd.length < 6){
    ctx.body = {
      'status': 'error',
      'param': 'psd'
    };
  }
  else{
    const { User } = ctx.orm('lifeManager');
    return User.create({
      email: email,
      psd: psd
    })
      .then((user)=>{
        ctx.body = {
          'status': 'OK',
          'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'favicon': user.favicon,
            'des': user.des
          }
        };
      })
      .catch((error)=>{
        ctx.body = {
          'status': 'error',
          'info': error
        }
      });
  }
});

userRouter.get('/:id', async (ctx, next)=>{
  if(!ctx.params.id){
    ctx.body = {
      'status': 'error',
      'info': 'no id'
    }
  }
  else{
    const { User } = ctx.orm('lifeManager');
    User.find(ctx.params.id)
      .then((user)=>{
        ctx.body = {
          'status': 'OK',
          'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'favicon': user.favicon,
            'des': user.des
          }
        };
      })
      .catch((error)=>{
        ctx.body = {
          'status': 'error',
          'info': error
        }
      });
  }
})

module.exports = userRouter;
