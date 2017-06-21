/*
* @Author: inksmallfrog
* @Date:   2017-05-19 07:48:05
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 08:14:56
*/

'use strict';
const Router = require('koa-router');

let todoRouter = new Router({
  prefix: '/todos'
});

function filterTodos(todos, type){
  switch(type){
    case 'all':
      break;
    case 'day':
      break;
    case 'week':
      break;
    case 'month':
      break;
    case 'year':
      break;
    case 'life':
      break;
  }
  return todos;
}

todoRouter.get('/', (ctx, next)=>{
  const userId = ctx.session.userId,
        type = ctx.request.query.type;
  if(!userId){
    ctx.body = {
      hasError: true,
      info: 'noSession'
    }
  }else{
    const {Todo, TodoFinished, Category, User } = ctx.orm('lifeManager');
    return Todo.findAll({
      include: [{
        model: Category,
        include: [{
          model: User,
          where: {
            id: userId
          },
          attributes:['id']
        }],
        attributes: ['id', 'title', 'color'],
      },{
        model: TodoFinished,
        attributes: ['status', 'createdAt']
      }],
      where:{
        state: 'doing'
      },
      attributes: ['id', 'content', 'type', 'ddl'],
      order: [
        ['createdAt', 'DESC']
      ]
    }).then((todos)=>{
      let todosFiltered = filterTodos(todos, type);
      ctx.body = {
        hasError: false,
        todos: todosFiltered
      }
    }).catch((err)=>{
      ctx.body = {
        hasError: true,
        info: err
      }
    })
  }
})
module.exports = todoRouter;
