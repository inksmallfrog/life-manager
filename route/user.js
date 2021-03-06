/*
* @Author: inksmallfrog
* @Date:   2017-05-07 18:05:11
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 17:22:56
*/

'use strict';
const Router = require('koa-router'),
      path = require('path'),
      config = require('../config/config');

let userRouter = new Router({
  prefix: '/users'
});

const koaBody = require('koa-body');
let userBody = koaBody({
  multipart: true
});

userRouter.get('/', async (ctx, next)=>{
  const ask = ctx.request.query.ask;
  switch(ask){
    case 'checkLogged':
      let userId = 0,
          fromSession = false;
      //检查session登陆
      if(ctx.session && ctx.session.userId){
        userId = ctx.session.userId;
        fromSession = true;
      }
      //检查cookie登陆
      if(!userId && ctx.cookies){
        userId = ctx.cookies.get('userId', {signed: true});
        fromSession = false;
      }
      if(!userId){
        ctx.body = {
          hasError: false,
          user: null
        }
      }
      else{
        if(!fromSession){
          //建立session连接
          ctx.session.userId = userId;
        }
        const { User } = ctx.orm('lifeManager');
        return User.findById(userId, {
            attributes: ['id', 'name', 'favicon', 'des']
          }).then((user)=>{
            if(!user){
              ctx.body={
                hasError: true,
                user: null
              }
            }else{
              //user.updateTodo();
              ctx.body = {
                hasError: false,
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  favicon: user.favicon,
                  des: user.des
                }
              };
            }
          });
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

userRouter.post('/', userBody, async (ctx, next)=>{
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
      }).then((user)=>{
          let expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 3600 * 1000);
          ctx.cookies.set('userId', user.id, {signed: true, expires: expires, httpOnly: true});
          ctx.session.userId = user.id;
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
        }).catch((error)=>{
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
          where:{
            email: email
          }
        }).then((user)=>{
          if(!user){
            ctx.body = {
              hasError: true,
              info: 'email'
            }
          }
          else if(user.psd != psd){
            ctx.body = {
              hasError: true,
              info: 'psd'
            }
          }
          else{
            //user.updateTodo();

            let expires = new Date();
            expires.setTime(expires.getTime() + 7 * 24 * 3600 * 1000);
            ctx.cookies.set('userId', user.id, {signed: true, expires: expires, httpOnly: true});
            ctx.session.userId = user.id;
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
        });
      break;
    }
    case 'quit':{
      ctx.session.userId = null;
      ctx.cookies.set('userId', null);
      ctx.body = {
        hasError: false
      }
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
userRouter.put('/', userBody, async(ctx, next)=>{
  const userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const {name, des, favicon} = ctx.request.body.fields,
          { User } = ctx.orm('lifeManager');
    return User.findById(userId)
      .then((oldUser)=>{
        return oldUser.update({
          name: name,
          des: des,
          favicon: favicon
        })
      })
      .then((newUser)=>{
        ctx.body = {
          hasError: false,
          user: newUser
        }
      })
      .catch((err)=>{
        ctx.body = {
          hasError: true,
          info: err
        }
      })
  }
})

let faviconBody = koaBody({
  formLimit: '10MB',
  multipart: true,
  formidable: {
    uploadDir: path.resolve(config.fileSysPath, 'static/upload_pics')
  }
});
userRouter.post('/favicon', faviconBody, async(ctx, next)=>{
  const userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    let favicon = ctx.request.body.files.favicon;
    if(!favicon){
      ctx.body = {
        hasError: true,
        info: 'noFavicon'
      }
    }else{
      ctx.body = {
        hasError: false,
        src: `static/upload_pics/${path.basename(favicon.path)}`
      }
    }
  }
});

userRouter.get('/:id', async (ctx, next)=>{
  const { User } = ctx.orm('lifeManager');
  return User.findById(ctx.params.id)
    .then((user)=>{
      ctx.body = {
        hasError: false,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          favicon: user.favicon,
          des: user.des
        }
      };
    })
    .catch((error)=>{
      ctx.body = {
        hasError: true,
        'info': error
      }
    });
})

module.exports = userRouter;
