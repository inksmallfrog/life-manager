/*
* @Author: inksmallfrog
* @Date:   2017-05-12 07:50:13
* @Last Modified by:   inksmallfrog
* @Last Modified time: 2017-05-12 08:21:13
*/

'use strict';
const fs = require('fs');
module.exports = {
  /*
 * 异步读取目录函数
 * @param dir 路径
 * @return promise对象，其返回目录下的所有文件名
 */
readdirAsync(dir){
  return new Promise((resolve, reject)=>{
      fs.readdir(dir, (err, files)=>{
         if(err) reject(err);
          else resolve(files);
      })
  });
},

/*
 * 异步读取文件内容
 * @param filePath 文件路径
 * @return promise对象，其返回文件的内容
 */
readFileAsync(filePath){
  return new Promise((resolve, reject)=>{
      fs.readFile(filePath, (err, data)=>{
          if(err) reject(err);
          else resolve(data);
      })
  })
},

/*
 * 异步打开文件
 * @param filePath 文件路径
 *        flags 打开方式
 * @return promise对象，其返回文件的内容
 */
openAsync(filePath, flags){
  return new Promise((resolve, reject)=>{
      fs.open(filePath, flags, (err, fd)=>{
          if(err) reject(err);
          else resolve(fd);
      })
  })
},

/*
 * 异步写文件
 * @param fd 文件描述符
 *        data 写入数据
 * @return promise对象，用于处理错误
 */
writeFile(fd, data){
  return new Promise((resolve, reject)=>{
      fs.writeFile(fd, data, (err)=>{
          if(err) reject(err);
          else resolve();
      })
  })
}
}
