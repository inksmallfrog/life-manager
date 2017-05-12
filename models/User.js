/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:59:52
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 18:56:15
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
      defaultValue: '/public/favicons/default.jpg'
    },
    des: {
      type: types.STRING(140),
      allowNull: true,
      defaultValue: '生活管家，感谢有你～'
    }
  }, {
    tableName: 'appUser'
  });
  User.associate = (models)=>{
    User.hasMany(models.TodoCategory, {
      foreignKey: 'userId'
    });
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
