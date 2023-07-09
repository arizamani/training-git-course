const express = require("express");
const router = express.Router();


// This is called a Route
router.get("/", function(req,res){
    res.render("index",{
        title: "My Express App",
        message:"Hello"
    });
});

module.exports = router;