
const startupDebug = require("debug")("app:startup");
const config = require("config");
const helmet = require("helmet"); //to secure header
const morgan = require("morgan"); //to log http request as a message to console
const logger = require("./logger");
const Joi = require("joi"); //to validation
const express = require("express");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); //this is set as a default value (and it is optional)

//Configuration 
console.log('Application name: '+config.get("name"));
console.log('Mail server: '+config.get("mail.host"));
console.log('Mail password: '+config.get("mail.password"));

//this is kind of Middlewar
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(helmet());

app.use(logger);

//get environment
if(app.get("env")==="development"){
    app.use(morgan("tiny"));
    startupDebug("Morgan enabled...");
}

const courses = [
    { id:1 , name: "Course1"},
    { id:2 , name: "Course2"},
    { id:3 , name: "Course3"}
];

// This is called a Route
app.get("/", function(req,res){
    res.send("Hello world...!");
});
app.get("/api/courses", function(req,res){
    res.send(courses);
});
app.get("/api/courses/:id", function(req,res){
    //res.send(req.params.id);
    const course = courses.find(function(a){
        return a.id === parseInt(req.params.id);
    });
    if (!course){
        res.status(404).send("The course with given id was not found");
        return; 
    } 
    res.send(course);
    
});
app.get("/api/posts/:year/:month", function(req,res){
    //res.send(req.params);
    res.send(req.query);
});


app.post("/api/courses", function(req,res){
    
    const {error,value} = validateCourse(req.body)
    if(error){
        //console.log(result.error)
        res.status(400).send(error.message);
        return;
    }
    const course ={
        id: courses.length + 1,
        name: value.name
    }
    courses.push(course);
    res.send(course);
})

app.put("/api/courses/:id", function(req,res){
    const course = courses.find(function(a){
            return a.id === parseInt(req.params.id);
    })
    if(!course) {
            res.status(404).send("The course with given id was not found");
            return;
    }
    
    const {error,value} = validateCourse(req.body)
    if(error){
        //console.log(result.error)
        res.status(400).send(error.message);
        return;
    }
    course.name = value.name;
    res.send(course);
});

app.delete("/api/courses/:id", function(req,res){
    const course = courses.find(function(a){
            return a.id === parseInt(req.params.id);
    })
    if(!course) {
            res.status(404).send("The course with given id was not found");
            return;
    }
    
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});

function validateCourse(course){
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    });

    return schema.validate(course);
}