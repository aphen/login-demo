var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.route('/login')
    .get(function(req, res) {
      if(req.session.user) {
        res.redirect('/home');
      }
      res.render('login', { title: '用户登录'});
    })
    .post(function(req, res, next){
      var name = req.body.username;
      var pwd = req.body.password;
        //从model中获取user对像
        var user = global.dbHandel.getModel('login');
       // var uname = req.body.uname; // 获取post提交来的数据
        user.findOne({name: name}, function(err, doc){
            console.log(doc);
            if(err){
                res.send(500);
            }else if (!doc){
                req.session.error = '用户名不存在';
                res.redirect('/login');
                //res.send(404);
            }else{
                if(pwd != doc.pwd){
                    req.session.error = '密码错误';
                    res.redirect('/login');
                    //res.send(404);
                }else{
                    req.session.user = doc;
                    res.send(200);
                }
            }
        })
      //var MongoClient = require('mongodb').MongoClient;
      //var url = "mongodb://localhost:27017/login";
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

      //MongoClient.connect(url, function(err, db) {
      //  if (err) throw err;
      //  if(!name || !pwd){
      //    req.session.error = '用户名和密码不能为空';
      //    res.redirect('/login');
      //    return;
      //  }
      //
      //  var dbo = db.db('login');
      //
      //  dbo.collection("login").find({name: name, pwd: pwd}).toArray(function(err, result) {
      //    if (err) throw err;
      //    console.log(result);
      //
      //    if(result.length){
      //      //res.send('登录成功!');
      //      req.session.user = result[0];
      //      res.redirect('/home');
      //    }else{
      //      req.session.error='用户名或密码不正确';
      //      res.redirect('/login');
      //    }
      //
      //    db.close();
      //  });
      //});
    })
router.route('/register')
    .get(function(req, res) {
      res.render('register', { title: '用户注册'});
    })
    .post(function(req, res, next) {
      var name = req.body.username;
      var pwd = req.body.password;

    })
router.get('/logout',function(req, res) {
  req.session.user = null;
  res.redirect('/');
});

router.get('/home', function(req, res){
  authentication(req, res);
  res.render('home', {title: 'Home', user: req.session.user})
});

function authentication(req, res){
  if(!req.session.user){
    return res.redirect('/login');
  }
}
module.exports = router;
