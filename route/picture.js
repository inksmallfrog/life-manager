/*
* @Author: inksmallfrog
* @Date:   2017-05-10 08:24:20
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 17:15:14
*/

'use strict';
const Router = require('koa-router'),
      path = require('path'),
      config = require('../config/config');

let pictureRouter = new Router({
  prefix: '/pictures'
});

const koaBody = require('koa-body');

let picBody = koaBody({
      formLimit: '10MB',
      multipart: true,
      formidable: {
        uploadDir: path.resolve(config.fileSysPath, 'static/upload_pics')
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
            pictures.push({src: `static/upload_pics/${path.basename(pictureFiles.path)}`, categoryId: category.id});
          }
          else{
            for(let pictureFile of pictureFiles){
              pictures.push({src: `static/upload_pics/${path.basename(pictureFiles.path)}`, categoryId: category.id});
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
