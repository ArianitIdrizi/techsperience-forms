var express=require("express");

var path=require("path");

var bodyParser=require("body-parser");

//init app



var app=express();





//setup template enginee

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname+'/public'));
app.set("view engine", "ejs");



// Body parser middleware

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));



//mongodb connections

const MongoClient=require("mongodb").MongoClient;

const mongoURL="mongodb://localhost:27017/student";
const objectId = require('mongodb').ObjectId;



MongoClient.connect(mongoURL, function(err, database){

	console.log("MongoDB connected!");

	if(err){

		console.log(err);

	}

	students=database.collection("students");

});







//routes

app.get("/",function(req,res){

	//res.send("Index page");
	students.find({}).toArray(function(err, docs){
			if(err){
			console.log(err);
			}
			res.render("index",{docs:docs});
			});
	});
	
app.get("/students/:id",function(req,res){
	students.findOne({_id:objectId(req.params.id)}, function(err, doc){
		if (err){
		console.log(err);
		}
		res.render("show",{doc:doc});
	});
	

});
	



app.post("/students/add",function(req,res){

	students.insert({username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, 
					gender: req.body.gender, birthday: req.body.birthday, education: req.body.education, 
					email: req.body.email, password: req.body.password, infields: req.body.infields,},function(err, result){

		if(err){

			console.log(err);

		}

		res.redirect("/");

	});	

});



app.get("/students/edit/:id",function(req,res){
		students.findOne({_id: objectId(req.params.id)}, function(err, doc){
			if (err){
			console.log(err);
			}
			res.render("edit",{doc:doc});

		
		});
		
});



app.post("/students/update/:id",function(req,res){
	students.updateOne({_id: objectId(req.params.id)}, 
	{$set: {username: req.body.username, firstname: req.body.firstname, lastname: req.body.lastname, 
					gender: req.body.gender, birthday: req.body.birthday, education: req.body.education, 
					email: req.body.email, password: req.body.password, infields: req.body.infields,}}, function(err, result){
		if(err){
		console.log(err);
		}
		res.redirect("/");
	});
	
	

});



app.get("/students/delete/:id",function(req,res){
	students.deleteOne({_id: objectId(req.params.id)}, function(err, result){
			if (err){
			console.log(err);
			}
			res.redirect("/");
	});
	

});







	

app.listen(5000, function(){

	console.log("App listening at http://localhost:5000");

});