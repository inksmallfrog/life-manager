/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:14:10
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:22:43
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Todo = sequelize.define('Todo', {
    content: {
      type: types.STRING(140),
      allowNull: false
    },
    status: {
      type: types.ENUM,
      values: ['todo', 'finished', 'cycle'],
      defaultValue: 'todo'
    },
    type: {
      type: types.ENUM,
      values: ['daily', 'weekly', 'monthly', 'yearly', 'life', 'temp'],
      defaultValue: 'temp'
    }
  });
  Todo.associate = (models)=>{
    Todo.belongsTo(models.TodoCategory, {
      foreignKey: 'categoryId'
    });
    Todo.hasMany(models.TodoFinished, {
      foreignKey: 'todoId'
    });
  };
  return Todo;
}
