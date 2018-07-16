var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function(req, res, next){
  var name = req.body.username;
  var pwd = req.body.password;
  console.log(name);
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/login";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;

    console.log("数据库已创建!");

    if(!name || !pwd){
      console.log('用户名密码不能为空');
      res.send('用户名不能为空');
      return;
    }

    var dbo = db.db('login');
    dbo.collection("login").find({name: name, pwd: pwd}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);

      if(result.length){
        res.send('登录成功!');
      }else{
        res.send('用户名密码不正确!');
      }

      db.close();
    });
  });
})

module.exports = router;
