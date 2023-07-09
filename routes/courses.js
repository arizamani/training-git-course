const Joi = require("joi"); //to validation
const express = require("express");
const router = express.Router();

const courses = [
    { id:1 , name: "Course1"},
    { id:2 , name: "Course2"},
    { id:3 , name: "Course3"}
];


router.get("/", function(req,res){
    res.send(courses);
});

router.get("/:id", function(req,res){
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

router.post("/", function(req,res){
    
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

router.put("/:id", function(req,res){
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

router.delete("/:id", function(req,res){
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

function validateCourse(course){
    const schema = Joi.object({
        name : Joi.string().min(3).required()
    });

    return schema.validate(course);
}

module.exports = router;