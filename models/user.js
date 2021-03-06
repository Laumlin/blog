
//var mongodb = require('./db');
var mongodb = require('mongodb');
var settings = require('../settings');
var crypto = require('crypto');
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

//存储用户信息
User.prototype.save = function(callback){
var md5 = crypto.createHash('md5'),
    email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//要存入数据库的用户信息文档
var user = {
    name: this.name,
    password: this.password,
    email: this.email,
    head: head
};
    //打开数据库
   mongodb.MongoClient.connect(settings.url, function (err, db) {
        if(err){
            return callback(err);
        }
    //读取users集合
        db.collection('users', function(err, collection){
            if(err){
                db.close();
                return callback(err);
            }
    //将用户数据插入users集合
    //为name属性增加索引
            collection.ensureIndex("name",{unique:true});
            collection.insert(user, {
                safe: true
            },function(err, user){
                db.close();
                if(err){
                    return callback(err);
                }
                callback(null, user[0]);//成功，err为null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get = function(name, callback){
    //打开数据库
    mongodb.MongoClient.connect(settings.url, function (err, db) {
        if(err){
            return callback(err);
        }
        //读取users集合
        db.collection('users', function(err,collection){
            if(err){
                db.close();
                return callback(err);
            }
        //查找用户名（name键）值为name一个文档
        collection.findOne({
            name: name
        },function(err, user){
            db.close();
            if(err){
                //var user = new User(doc);
                callback(err);
            }
            callback(null, user);//成功 返回查询的用户信息
          });
        });
    });
};


// async
// var mongodb = require('mongodb');
// var settings = require('../settings');
// var crypto = require('crypto');
// var async = require('async');

// function User(user) {
//   this.name = user.name;
//   this.password = user.password;
//   this.email = user.email;
// };

// module.exports = User;

// User.prototype.save = function(callback) {
//   var md5 = crypto.createHash('md5'),
//       email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
//       head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
//   var user = {
//       name: this.name,
//       password: this.password,
//       email: this.email,
//       head: head
//   };
//   async.waterfall([
//     function (cb) {
//       mongodb.MongoClient.connect(settings.url, function (err, db) {
//         cb(err, db);
//       });
//     },
//     function (db, cb) {
//       db.collection('users', function (err, collection) {
//         cb(err, collection);
//       });
//     },
//     function (collection, cb) {
//       collection.insert(user, {
//         safe: true
//       }, function (err, user) {
//         cb(err, user);
//       });
//     }
//   ], function (err, user) {
//     db.close();
//     callback(err, user[0]);
//   });
// };

// User.get = function(name, callback) {
//   async.waterfall([
//     function (cb) {
//       mongodb.MongoClient.connect(settings.url, function (err, db) {
//         cb(err, db);
//       });
//     },
//     function (db, cb) {
//       db.collection('users', function (err, collection) {
//         cb(err, collection);
//       });
//     },
//     function (collection, cb) {
//       collection.findOne({
//         name: name
//       }, function (err, user) {
//         cb(err, user);
//       });
//     }
//   ], function (err, user) {
//     db.close();
//     callback(err, user);
//   });
// };