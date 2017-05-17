/*
* @Author: inksmallfrog
* @Date:   2017-05-10 08:24:20
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-17 11:25:28
*/

'use strict';
'use strict';
const Router = require('koa-router');

let pictureRouter = new Router({
  prefix: '/pictures'
});

const koaBody = require('koa-body');
let picBody = koaBody({
  formLimit: '10MB',
  multipart: true,
  formidable: {
    uploadDir: 'public/upload_pics'
  }
});

pictureRouter.post('/', picBody, (ctx, next)=>{
  let userId = ctx.session.userId;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    let pictureFiles = ctx.request.body.files.pictures;
    if(!pictureFiles){
      ctx.body = {
        hasError: true,
        param: 'pictures'
      };
    }
    else{
      console.log(pictureFiles);
      let { Picture, Category } = ctx.orm('lifeManager');
      return Category.findOne({
        where: {
          userId: userId,
          type: 'photograph',
          title: '文章'
        },
        attributes: ['id']
      }).then((category)=>{
        if(!category){
          ctx.body = {
            hasError: true,
            info: 'no picture category'
          };
        }else{
          let pictures = [];
          if(!pictureFiles.length){
            pictures.push({src: pictureFiles.path, categoryId: category.id});
          }
          else{
            for(let pictureFile of pictureFiles){
              console.log(pictureFile.path);
              pictures.push({src: pictureFile.path, categoryId: category.id});
            }
          }
          return Picture.bulkCreate(pictures)
            .then(()=>{
              ctx.body = {
                hasError: false,
                pictures: pictures
              };
            })
            .catch((err)=>{
              ctx.body = {
                hasError: true,
                info: err
              };
            });
        }
      });
    }
  }
})
module.exports = pictureRouter;
