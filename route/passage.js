/*
* @Author: inksmallfrog
* @Date:   2017-05-09 09:33:14
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 12:52:33
*/

'use strict';
const Router = require('koa-router'),
      fs = require('fs'),
      Crypto = require('crypto'),
      fsPromise = require('../lib/fsPromise');

let passageRouter = new Router({
  prefix: '/passages'
});

const koaBody = require('koa-body');
let passageBody = koaBody({
  multipart: true
});

passageRouter.get('/', (ctx, next)=>{
  const userId = ctx.request.query.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noUserId'
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
        attributes: ['id', 'title']
      }],
      attributes: ['id', 'title', 'src', 'state', 'createdAt'],
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
});

passageRouter.get('/:id', (ctx, next)=>{
  const passageId = ctx.params.id,
        { Passage, Category, User, Comment } = ctx.orm('lifeManager');
  let json = {};
  return Passage.findById(passageId, {
    include: [
      {
        model: Category,
        include: [{
          model: User,
          attributes:['id']
        }],
        attributes: ['id', 'title']
      },
      {
        model: Comment,
        order: [
          ['createdAt', 'DESC']
        ]
      }
    ],
    attributes: ['id', 'title', 'src', 'createdAt']
  }).then((passage)=>{
    json = passage;
    return fsPromise.readFileAsync(passage.src);
  }).then((content)=>{
    ctx.body = {
      passage: json,
      content: content.toString()
    }
  });
});

function createNewPassage(Passage, title, categoryId, type, content){
  let md5 = Crypto.createHash('md5'),
      fileName = md5.update(content).digest('hex'),
      src = `public/passages/${fileName}.md`,
      times = 0;
  //save content
  //...
  while(fs.exists(src)){
    md5 = Crypto.createHash('md5')
    fileName = md5.update(content + times).digest('hex');
    ++times;
    src = `public/passages/${fileName}.md`;
  }
  return fsPromise.openAsync(src, 'w')
    .then((fd)=>{
      return fsPromise.writeFile(fd, content);
    })
    .then(()=>{
      return Passage.create({
        title: title,
        categoryId: categoryId,
        state: type,
        src: src
      });
    })
}

function updatePassage(Passage, id, title, categoryId, type, content){
  return Passage.findById(id)
    .then((oldPassage)=>{
      console.log(oldPassage);
      const {title, src, state, categoryId} = oldPassage;
      //update content
      fsPromise.openAsync(src, 'w')
        .then((fd)=>{
          fsPromise.writeFile(fd, content);
        });

      type = (state == 'published' ? 'published' : type);
      return oldPassage.update({
        title: title,
        categoryId: categoryId,
        state: type,
      });
    });
}

passageRouter.post('/', passageBody, (ctx, next)=>{
  let userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const { id, title, category, content } = ctx.request.body,
          type = ctx.request.query.type,
          { Passage, Category, User } = ctx.orm('lifeManager');

    if(category.id == -1){
      return Category.create({
        title: category.title,
        type: 'passage',
        userId: userId
      }).then((category)=>{
        if(id == -1){
          return createNewPassage(Passage, title, category.id, type, content)
            .then((passage)=>{
              ctx.body = passage;
            });
        }else{
          return updatePassage(Passage, id, title, category.id, type, content)
            .then((passage)=>{
              ctx.body = passage;
            });
        }
      })
    }else{
      if(id == -1){
        return createNewPassage(Passage, title, category.id, type, content)
            .then((passage)=>{
              ctx.body = passage;
            });
      }else{
         return updatePassage(Passage, id, title, category.id, type, content)
            .then((passage)=>{
              ctx.body = passage;
            });
      }
    }
  }
});

passageRouter.del('/:id', (ctx, next)=>{
  const id = ctx.params.id;
  let userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const { Passage, Category, User } = ctx.orm('lifeManager');
    return Passage.findById(id, {
      include: [{
        model: Category,
        include: [{
          model: User,
          where: {
            id: userId
          },
          attributes:['id']
        }],
      }],
    }).then((passage)=>{
        if(passage.Category.User.id == userId){
          return passage.destroy();
        }
        else{
          ctx.body = {
            hasError: true
          }
          return new Promise();
        }
      }).then(()=>{
        ctx.body = {
          hasError: false
        }
      });
  }
})
module.exports = passageRouter;
