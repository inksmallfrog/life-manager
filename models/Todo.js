/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:14:10
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-19 08:43:16
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Todo = sequelize.define('Todo', {
    content: {
      type: types.STRING(140),
      allowNull: false
    },
    state: {
      type: types.ENUM,
      values: ['failed', 'finished', 'doing'],
      defaultValue: 'doing'
    },
    type: {
      type: types.ENUM,
      values: ['daily', 'weekly', 'monthly', 'yearly', 'life', 'temp'],
      defaultValue: 'temp'
    },
    ddl: {
      type: types.DATE,
      allowNull: true
    }
  });
  Todo.associate = (models)=>{
    Todo.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    });
    Todo.hasMany(models.TodoFinished, {
      foreignKey: 'todoId'
    });
  };
  return Todo;
}
