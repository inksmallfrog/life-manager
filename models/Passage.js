/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:31:02
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:24:25
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Passage = sequelize.define('Passage', {
    src: {
      type: types.STRING(80),
      allowNull: false,
      unique: true
    }
  });
  Passage.associate = (models)=>{
    Passage.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    Passage.hasMany(models.Comment, {
      foreignKey: 'passageId'
    });
  };
  return Passage;
}
