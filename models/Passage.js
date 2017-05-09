/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:31:02
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-09 10:50:35
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Passage = sequelize.define('Passage', {
    title:{
      type: types.STRING(10),
      allowNull: false
    },
    state:{
      //0:published
      //1:script
      type: types.ENUM,
      values: ['published', 'script'],
      defaultValue: 'published'
    },
    src: {
      type: types.STRING(80),
      allowNull: false,
      unique: true
    }
  });
  Passage.associate = (models)=>{
    Passage.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    });
    Passage.hasMany(models.Comment, {
      foreignKey: 'passageId'
    });
  };
  return Passage;
}
