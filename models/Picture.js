/*
* @Author: inksmallfrog
* @Date:   2017-05-10 08:25:36
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-06-21 16:05:24
*/

'use strict';
module.exports = (sequelize, types)=>{
  let Picture = sequelize.define('Picture', {
    title:{
      type: types.STRING(10),
      allowNull: true
    },
    src: {
      type: types.STRING(1024),
      allowNull: false,
      unique: true
    }
  });
  Picture.associate = (models)=>{
    Picture.belongsTo(models.Category, {
      foreignKey: 'categoryId'
    });
  };
  return Picture;
}
