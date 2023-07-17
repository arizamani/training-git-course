
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
    name: {
        type: String,
        required: '{PATH} is required!',
        /*
        validate: [
            {validator: v => v!="" || v!=null, message: "Name field couldn't be empty" },
            {validator: validator, message: 'uh oh' }
        ]
        */
    },
    author: {type: String, default: "Arash Zamani"},
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: {type: Boolean, default: false}
});

const Course = db.model("Course",courseSchema);

async function getCourses(){
    const result = await Course.find()
    .limit(10).
    sort({name:1});
    //select({name:1});
    startupDebug(result);
    return result;
} 

async function getCourse(id){

    const course = await Course.findById(id);
    if (!course) return Promise.reject(new Error("The course with given id was not found",{cause: {code: 404}}));

    startupDebug(course);
    return course;
}

async function updateCourse(id,courseObj){
    
    const course = await Course.findByIdAndUpdate(id,{$set: courseObj},{new: true});
    if (!course) return Promise.reject(new Error("The course with given id was not found"));

    startupDebug(course);
    return course;
} 

async function createCourse(courseObj){
    const course = new Course(courseObj);
    //if (!course) return Promise.reject(new Error("Not valid Name format...",{cause: {code: 400}}));
    /*
    const course = new Course({
        name: "React Course",
        author: "Arash Zamani",
        tags:["react","frontend"],
        isPublished: true
    });
    */
    const result = await course.save();
    startupDebug(result);
    return result;   
}

async function removeCourse(id){
    const result = await Course.findByIdAndDelete(id);
    if (!result) return Promise.reject(new Error("The course with given id was not found",{cause: {code: 404}}));
    startupDebug(result);
    return result;
}


module.exports.getCourses= getCourses;
module.exports.getCourse= getCourse;
module.exports.updateCourse= updateCourse;
module.exports.createCourse= createCourse;
module.exports.removeCourse= removeCourse;
