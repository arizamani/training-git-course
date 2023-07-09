const express = require("express");
const router = express.Router();

router.get("/:year/:month", function(req,res){
    //res.send(req.params);
    res.send(req.params);
});

module.exports = router;