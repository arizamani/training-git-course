
const db = require("../database/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/", function(req,res){
    db.getUsers().then(function(result){
        res.send(result);
    })  
});

router.get("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    db.getUser(id).then(function(result){
        res.send(result);
    }).catch(function(err){
        let errorCode = err.cause.code;
        res.status(errorCode).send(err.message);
    });
});

router.post("/", function(req,res){
    const {error,value} = db.validateUser(req.body,"post");
    if(error) return res.status(400).send(error.message);

    db.createUser(value).then(function(result){
        res.send(_.pick(result,['_id','name','email']));
    }).catch(function(err){
        let errorCode = err.cause.code;
        res.status(errorCode).send(err.message);
    });
})

router.put("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    const {error,value} = db.validateUser(req.body,"put");
    if(error) return res.status(400).send(error.message);

    db.updateUser(id,value).then(function(result){
        res.send(result);
    });


});

router.delete("/:id", function(req,res){
    const id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).send("Not valid id format...");

    db.removeUser(id).then(function(result){
        res.send(result);
    }).catch(function(err){
        let errorCode = err.cause.code;
        res.status(errorCode).send(err.message);
    });
});



module.exports = router;