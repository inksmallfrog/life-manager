/*
* @Author: inksmallfrog
* @Date:   2017-05-09 08:43:00
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 09:26:58
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Category = sequelize.define('Category', {
    title:{
      type: types.STRING(10),
      allowNull: false
    },
    type:{
      type: types.ENUM,
      values: ['passage', 'photograph', 'todo']
    }
  });
  Category.associate = (models)=>{
    Category.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Category.hasMany(models.Passage, {
      foreignKey: 'categoryId'
    });
    Category.hasMany(models.Todo, {
      foreignKey: 'categoryId'
    });
  };
  return Category;
}
