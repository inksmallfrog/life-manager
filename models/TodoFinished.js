/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:28:20
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:23:37
*/

'use strict';
module.exports = (sequelize, types)=>{
  let TodoFinished = sequelize.define('TodoFinished');
  TodoFinished.associate = (models)=>{
    TodoFinished.belongsTo(models.Todo, {
      foreignKey: 'todoId'
    });
  };
  return TodoFinished;
}
