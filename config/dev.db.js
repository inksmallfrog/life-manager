/*
* @Author: inksmallfrog
* @Date:   2017-05-07 15:39:16
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-07 15:42:55
*/

'use strict';
const path = require('path');
module.exports = {
  name: 'lifeManager',
  modelPath: join(__dirname, '../models'),
  db: 'lifeManager',
  username: 'youruser',
  password: 'yourpassword',
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  pool: {
    maxConnections: 10,
    minConnections: 0,
    maxIdleTime: 30000
  }
}
