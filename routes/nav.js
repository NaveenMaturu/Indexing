var express = require('express');
var router=express.Router();
var Sequelize = require('sequelize');
var bodyParser = require('body-parser');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var app = express();



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var rc = redis.createClient(6379, 'localhost');

var sequelize = new Sequelize('charu', 'root', 'Naveen@368',
{
	host:"127.0.0.1",
	port:3306,
	dialect:"mariadb",
	define: {
        timestamps: false
			}
});
//var Instance = require('sequelize/lib/instance');

sequelize.sync().then(function() {
	
	console.log("hi");
},
function(err){
	console.error('database prb'+err)
});


var User = sequelize.define('mani', {
	 
	     "name": Sequelize.STRING,
		"email":  Sequelize.STRING,
	    "username": Sequelize.STRING,
		"password": Sequelize.STRING,
		"phno":Sequelize.STRING,
	},{
        indexes: [
            {
				 name: 'maturu',
                unique: false,
                fields: ['username','email']
            }
        ]
    });

	router.post('/',function(req,res){
console.log(JSON.stringify(req.body.name));

 User.create({
	             "name":req.body.name,
	             "email":req.body.email,
	             "username":req.body.username,
				 "password": req.body.password,
		          "phno":req.body.phno
 	         }).
 
    then(function(a) {  
        res.json(a);  
    }, function(error) {  
        res.send(error);  
    });  
});


/*app.param(['email', 'limit','offset'], function (req, res, next, value) {
  next();
});
var Post = sequelize.define('table2', {
  "title": Sequelize.STRING,
 "review" :Sequelize.STRING,
  "hero": Sequelize.STRING,
  },{timestamps:false});

router.post('/p',function(req,res,next){

 Post.create({"id":req.body.id,"title":req.body.title,"review":req.body.review,"hero":req.body.hero}).  
    then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});*/

//User.hasMany(Post, {foreignKey: 'id'})
//Post.belongsTo(User, {foreignKey: 'id'})


/*router.get('/:id',function(req,res,next){
 console.log("hi")
 Post.find({
  where:{
   id: req.params.id
  },include:[User]
 }).then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});*/



router.get('/:username/:limit/:offset',function(req,res){
	
	//var nav= req.param('email');
	
	var nav = req.param('username');
	
		var nav1=req.param('limit');
		var b=parseInt(nav1);
		
		var nav2= req.param('offset');
		var c=parseInt(nav2);
		
		console.log("username :"+nav+""+"limit"+nav1+"offset"+nav2);
	
	var cacheObj = cacher(sequelize, rc)
  .model('mani')
  .ttl(1000);
  
	cacheObj.findAll({
		where:{
			"username": nav
		},limit:b,offset:c
	})
  .then(function(jane) {  
        res.json(jane);  
    }, function(error) {  
        res.send(error);  
    });  
});

router.delete('/:email', function(req, res) {  
    var a = {  
        email: req.params.email  
    };  
    User.destroy({  
        where: {  
            email:a.email  
        }  
    }).  
    then(function(jane) {  
        res.json(jane);  
    });  
});

router.put('/update', function(req, res) {  
    var a = {    
        "email": req.body.email,  
        "username": req.body.username,
		"phno":req.body.phno
    };  
  
    User.update(a, {  
        where: {  
            email: a.email  
        }  
    }).  
    then(function(a) {  
        res.status(200).json(a);  
    });  
});
	

module.exports = sequelize;
module.exports = User;
//module.exports=mani;
module.exports = router;

