/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:20:50
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:23:03
*/

'use strict';
module.exports = (sequelize, types)=>{
  let TodoCategory = sequelize.define('TodoCategory', {
    title: {
      type: types.STRING(1880),
      defaultValue: '新的Todo分类'
    },
    color: {
      type: types.STRING(8),
      defaultValue: '#ff0000',
      validate:{
        is: /#([0-9a-f]{3} | [0-9a-f]{6})/i
      }
    }
  }, {
    timestamp: false
  });
  TodoCategory.associate = (models)=>{
    TodoCategory.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    TodoCategory.hasMany(models.Todo, {
      foreignKey: 'categoryId'
    });
  };
  return TodoCategory;
}
