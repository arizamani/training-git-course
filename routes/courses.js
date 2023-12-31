
const db = require("../database/playground");
const express = require("express");
const router = express.Router();

router.get("/", function(req,res){
    db.getCourses().then(function(result){
        res.send(result);
    })  
});

router.get("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    db.getCourse(id).then(function(result){
        res.send(result);
    }).catch(function(err){
        let errorCode = err.cause.code;
        res.status(errorCode).send(err.message);
    });
});

router.post("/", function(req,res){
    const {error,value} = db.validateCourse(req.body,"post");
    if(error) return res.status(400).send(error.message);

    db.createCourse(value).then(function(result){
        res.send(result);
    }).catch(function(err){
        let errorCode = err.cause.code;
        console.log(err.message);
        //let a = err.arrayOfException();
        res.status(errorCode).send(err.message);
    });
})

router.put("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    const {error,value} = db.validateCourse(req.body,"put");
    if(error) return res.status(400).send(error.message);

    db.updateCourse(id,value).then(function(result){
        res.send(result);
    });


});

router.delete("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    db.removeCourse(id).then(function(result){
        res.send(result);
    }).catch(function(err){
        let errorCode = err.cause.code;
        res.status(errorCode).send(err.message);
    });
});



module.exports = router;