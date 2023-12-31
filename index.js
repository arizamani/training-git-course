
//const db = require("./database/playground");
const startupDebug = require("debug")("app:startup");
const db = require("mongoose");
const config = require("config");
const helmet = require("helmet"); //to secure header
const morgan = require("morgan"); //to log http request as a message to console
const logger = require("./middleware/logger");
const courses = require("./routes/courses");
const posts = require("./routes/post");
const home = require("./routes/home");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

//Databse connection
const databaseUrl = config.get("database.url") + config.get("database.name");
db.connect(databaseUrl)
    .then(function(){
        startupDebug(`Connected to MongoDB on port: ${db.connection.port}`);
    })
    .catch(function(err){
        startupDebug(err.message);
    });


app.set("view engine", "pug");
app.set("views", "./views"); //this is set as a default value (and it is optional)

//Configuration 
console.log('Application name: '+ config.get("name"));
console.log('Mail server: '+ config.get("mail.host"));
console.log('Mail password: '+ config.get("mail.password"));


//this is kind of Middlewar
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);
app.use("/", home);
app.use("/api/courses", courses);
app.use("/api/post", posts);
app.use("/api/users", users);
app.use("/api/auth", auth);

//get environment
if(app.get("env")==="development"){
    app.use(morgan("tiny"));
    startupDebug("Morgan enabled...");
}


//make a port ready
const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});

