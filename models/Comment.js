/*
* @Author: inksmallfrog
* @Date:   2017-05-07 16:32:41
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 17:24:31
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Comment = sequelize.define('Comment', {
    content: {
      type: types.STRING(140),
      allowNull: false
    }
  });
  Comment.associate = (models)=>{
    Comment.belongsTo(models.User, {
      foreignKey: 'commenterId'
    })
    Comment.belongsTo(models.Passage, {
      foreignKey: 'passageId'
    });
  };
  return Comment;
}
