
const Joi = require("joi");
const express = require("express");
const app = express();
app.use(express.json());

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
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    });

    const result = schema.validate(req.body);

    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }
    const course ={
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(courses);
})


const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});