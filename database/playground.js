
const startupDebug = require("debug")("app:startup");
const config = require("config");
const db = require("mongoose");

//Databse connection
const databaseUrl = config.get("database.url") + config.get("database.name");
db.connect(databaseUrl)
    .then(function(){
        startupDebug(`Connected to MongoDB on port: ${db.connection.port}`);
    })
    .catch(function(err){
        startupDebug(err.message);
    });
//Database Schema
const courseSchema = new db.Schema({
    name: String,
    author: String,
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: Boolean
});

const Course = db.model("Course",courseSchema);

async function createCourse(){
    const course = new Course({
        name: "React Course",
        author: "Arash Zamani",
        tags:["react","frontend"],
        isPublished: true
    });
    const result = await course.save();
    startupDebug(result);
}

async function getCourses(){
    const result = await Course.find()
    .limit(10).
    sort({name:1}).
    select({name:1});
    startupDebug(result);
    return result;
} 

async function getCourse(id){
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return Promise.reject(new Error("Not valid id format..."));

    const course = await Course.findById(id);
    if (!course) return Promise.reject(new Error("Not found..."));

    startupDebug(course);
    return course;
}

async function updateCourse(id){
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return Promise.reject(new Error("Not valid id format..."));
    const course = await Course.findById(id);
    if (!course) return Promise.reject(new Error("Not found..."));
    course.set({
        isPublished: true,
        author: "Another one"
    });
    const result = await course.save();
    startupDebug(result);
} 


module.exports.createCourse= createCourse;
module.exports.getCourses= getCourses;
module.exports.getCourse= getCourse;
module.exports.updateCourse= updateCourse;
