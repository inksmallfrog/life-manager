/*
* @Author: inksmallfrog
* @Date:   2017-05-07 18:05:11
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-08 16:10:09
*/

'use strict';
const Router = require('koa-router');

let userRouter = new Router({
  prefix: '/users'
});

userRouter.get('/', async (ctx, next)=>{
  const ask = ctx.request.query.ask;
  switch(ask){
    case 'checkLogged':
      //检查session/cookie登陆
      let userId = ctx.session.userId;
      if(!userId){
        userId = ctx.cookies.get('userId', {signed: true});
        if(!userId){
          ctx.body = {
            hasError: false,
            user: null
          }
        }
        else{
          //建立session连接
          ctx.session.userId = userId;
          //获取用户信息
          const { User } = ctx.orm('lifeManager');
          return User.find(userId)
                  .then((user)=>{
                    ctx.body = {
                      hasError: false,
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
                      hasError: true,
                      info: error
                    }
                  });
        }
      }
      break;
    default:
      break;
  }
});

function handleEmail(email){
  if(!email || !/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(email)){
    return {
      hasError: true,
      type: 'invalid',
      param: 'email'
    };
  }else{
    return {
      hasError: false
    };
  }
}

function handlePsd(psd){
  if(!psd || psd.length < 6){
    return {
      hasError: true,
      type: 'invalid',
      param: 'psd'
    };
  }
  else{
    return{
      hasError: false,
      psdEncryped: psd //encrypt psd here
    }
  }
}

userRouter.post('/', async (ctx, next)=>{
  const ask = ctx.request.query.ask;
  const { User } = ctx.orm('lifeManager');
  switch(ask){
    case 'regist':
    {
      let {email, psd} = ctx.request.body.fields,
          emailRes = handleEmail(email),
          psdRes = handlePsd(psd);
      if(emailRes.hasError){
        ctx.body = emailRes
      }
      else if(psdRes.hasError){
        ctx.body = psdRes
      }
      psd = psdRes.psdEncryped;
      //创建新用户
      return User.create({
        email: email,
        psd: psd
      })
        .then((user)=>{
          ctx.body = {
            hasError: false,
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
            hasError: true,
            info: error
          }
        });
      break;
    }
    case 'loggin':
    {
      let {email, psd} = ctx.request.body.fields,
          emailRes = handleEmail(email),
          psdRes = handlePsd(psd);
      if(emailRes.hasError){
        ctx.body = emailRes
      }
      else if(psdRes.hasError){
        ctx.body = psdRes
      }
      return User.findOne({
        email: email,
      })
        .then((user)=>{
          if(!user){
            ctx.body = {
              hasError: true,
              type: 'nomatch',
              param: "email"
            }
          }
          else if(user.psd != psd){
            ctx.body = {
              hasError: true,
              type: 'nomatch',
              param: 'psd'
            }
          }
          else{
            ctx.body = {
              hasError: false,
              user: {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'favicon': user.favicon,
                'des': user.des
              }
            };
          }
        })
        .catch((error)=>{

        });
      break;
    }
    case 'emailexists':
    {
      let { email } = ctx.request.body,
          emailRes = handleEmail(email);
      if(emailRes.hasError){
        ctx.body = emailRes
      }
      return User.findOne({
        where: {
          email: email
        }
      }).then((user)=>{
        if(!user){
          ctx.body = {
            hasError: false,
            exist: false
          }
        }
        else{
          ctx.body = {
            hasError: false,
            exist: true
          }
        }
      }).catch((err)=>{
        ctx.body = {
          hasError: true,
          info: err
        }
      })
      break;
    }
    default:
      break;
  }
});

userRouter.get('/:id', async (ctx, next)=>{
  if(!ctx.params.id){
    ctx.body = {
      hasError: true,
      info: 'no id'
    }
  }
  else{
    const { User } = ctx.orm('lifeManager');
    User.find(ctx.params.id)
      .then((user)=>{
        ctx.body = {
          hasError: false,
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
          hasError: true,
          'info': error
        }
      });
  }
})

module.exports = userRouter;
