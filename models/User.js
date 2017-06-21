/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:59:52
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 16:16:38
*/

'use strict';
module.exports = (sequelize, types)=>{
  let User = sequelize.define('User', {
    email: {
      type: types.STRING(80),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    psd: {
      type: types.STRING(80),
      allowNull: false,
      validate: {
        min: 6
      }
    },
    name: {
      type: types.STRING(80),
      defaultValue: '新用户'
    },
    favicon:{
      type: types.STRING(80),
      defaultValue: '/static/favicons/default.jpg'
    },
    des: {
      type: types.STRING(140),
      allowNull: true,
      defaultValue: '小蛙制造，感谢有你～'
    }
  }, {
    tableName: 'appUser'
  });
  User.associate = (models)=>{
    //更新用户的Todo状态
    User.updateTodo = function(){
      const {Todo, TodoFinished, Category, User } = models;
      Todo.findAll({
        include: [{
          model: Category,
          include: [{
            model: User,
            where: {
              id: this.userId
            },
            attributes:['id']
          }],
          attributes: ['id'],
        },{
          model: TodoFinished,
          attributes: ['status', 'createdAt'],
          order: [
            ['createdAt', 'DESC']
          ]
        }],
        attributes: ['id', 'type', 'ddl'],
        order: [
          ['createdAt', 'DESC']
        ]
      }).then((todos)=>{
        for(const todo of todos){
          switch(todo.type){
            case 'daily':{
              console.log(todo.TodoFinished);
              let lastFinished;
              if(todo.TodoFinished && todo.TodoFinished.length){
                lastFinished = new Date(todo.TodoFinished[0].targetDate);
              }else{
                lastFinished = new Date(todo.createdAt);
              }
              let today = new Date(),
                  dirta_day = today.getDay() - lastFinished.getDay();
              for(let i = 1; i < dirta_day; ++i){
                TodoFinished.create({
                  todoId: todo.id,
                  targetDate: lastFinished.setDate(lastFinished.getDate() + i),
                  state: 'failed'
                });
              }
              break;
            }
            case 'weekly':{
              let lastFinished;
              if(todo.TodoFinished && todo.TodoFinished.length){
                lastFinished = new Date(todo.TodoFinished[0].targetDate);
              }else{
                lastFinished = new Date(todo.createdAt);
              }
              let today = new Date(),
                  dirta_day = today.getDay() - lastFinished.getDay();
              for(let i = 7; i < dirta_day; i += 7){
                TodoFinished.create({
                  todoId: todo.id,
                  targetDate: lastFinished.setDate(lastFinished.getDate() + i),
                  state: 'failed'
                });
              }
              break;
            }
            case 'monthly':{
              let lastFinished;
              if(todo.TodoFinished && todo.TodoFinished.length){
                lastFinished = new Date(todo.TodoFinished[0].targetDate);
              }else{
                lastFinished = new Date(todo.createdAt);
              }
              let today = new Date(),
                  dirta_month = today.getMonth() - lastFinished.getMonth();
              for(let i = 1; i < dirta_month; ++i){
                TodoFinished.create({
                  todoId: todo.id,
                  targetDate: lastFinished.setMonth(lastFinished.getMonth() + i),
                  state: 'failed'
                });
              }
              break;
            }
            case 'yearly':{
              let lastFinished;
              if(todo.TodoFinished && todo.TodoFinished.length){
                lastFinished = new Date(todo.TodoFinished[0].targetDate);
              }else{
                lastFinished = new Date(todo.createdAt);
              }
              let today = new Date(),
                  dirta_year = today.getYear() - lastFinished.getYear();
              for(let i = 1; i < dirta_year; ++i){
                TodoFinished.create({
                  todoId: todo.id,
                  targetDate: lastFinished.setYear(lastFinished.getYear() + i),
                  state: 'failed'
                });
              }
              break;
            }
            case 'life':
              break;
            case 'temp':{
              if(todo.TodoFinished && todo.TodoFinished.length){
                //do nothing
              }else{
                let ddl = new Date(todo.ddl),
                    now = new Date();
                if(ddl < now){
                  todo.update({
                    state: 'failed'
                  });
                  TodoFinished.create({
                    todoId: todo.id,
                    targetDate: now,
                    state: 'failed'
                  });
                }
              }
              break;
            }
            default:
              break;
          }
        }
      })
    };
    User.hasMany(models.Category, {
      foreignKey: 'userId'
    });
    User.hasMany(models.Comment, {
      foreignKey: 'commenterId'
    });
    User.hook('afterCreate', (user)=>{
      models.Category.create({
        title: '默认',
        type: 'passage',
        userId: user.id
      });
      models.Category.create({
        title: '文章',
        type: 'photograph',
        userId: user.id
      });
    })
  };
  return User;
}
