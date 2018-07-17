var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.route('/login')
    .get(function(req, res) {
      res.render('login', { title: '用户登录'});
    })
    .post(function(req, res, next){
      var name = req.body.username;
      var pwd = req.body.password;

      var MongoClient = require('mongodb').MongoClient;
      var url = "mongodb://localhost:27017/login";
      //mongoose.connect(url, function(error){
      //  if (error) throw error;
      //  console.log('数据库连接成功')
      //
      //  if(!name || !pwd){
      //    console.log('用户名密码不能为空');
      //    res.send('用户名不能为空');
      //    return;
      //  }
      //
      //
      //});

      //var UserSchema = new mongoose.Schema({
      //  username: String,
      //  password: String,
      //  salt: String,
      //  hash: String
      //});
      //var User = mongoose.model('users', UserSchema);

      MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        console.log("数据库已创建!");

        if(!name || !pwd){
          console.log('用户名密码不能为空');
          res.send('用户名和密码不能为空');
          return;
        }

        var dbo = db.db('login');
        dbo.collection("login").find({name: name, pwd: pwd}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);

          if(result.length){
            //res.send('登录成功!');
            //res.session.user = result[0];
            res.redirect('/home');
          }else{
            res.redirect('/login');
          }

          db.close();
        });
      });
    })

router.get('/logout',function(req, res) {
  res.redirect('/');
});

router.get('/home', function(req, res){
  var user = {
    username: 'admin',
    password: '123456'
  }
  res.render('home', {title: 'Home', user: user})
});

module.exports = router;
