
const startupDebug = require("debug")("app:startup");
const db = require("mongoose");
const Joi = require("joi"); //to validation

//Database Schema
const courseSchema = new db.Schema({
    name: {
        type: String,
        required: '{PATH} is required!',
        minlength:5,
        maxlength: 255,
        //match: /pattern/
        //lowercase: true
        //uppercase: true
        //trim: ture

    },
    category:{
        type: String,
        required: '{PATH} is required!',
        enum: ['front-end', 'back-end']
    },
    author: {type: String, default: "Arash Zamani"},
    tags: [String],
    date: {type: Date, default: Date.now},
    isPublished: {type: Boolean, default: false},
    price:{
        type: Number, 
        required: [
            function() { return this.isPublished;},
            "{PATH} is required"
        ]
        //min:5
        //max:20
        /*
        get: funvtion(v){
            return Math.round(v);
        }
        set: funvtion(v){
            return Math.round(v);
        }
        */
    }
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
    if (!course) return Promise.reject(new Error("The course with given id was not found",{cause: {code: 404}}));

    startupDebug(course);
    return course;
} 

async function createCourse(courseObj){
    const course = new Course(courseObj);

    try{
        const result = await course.save();
        startupDebug(result);
        return result; 
    }catch(err){
        let exceptionArray = [];
        let i = 1;
        for (const ex in err.errors) {
            exceptionArray.push(i+ ": " +err.errors[ex].message);
            i++;
        }
        let msg = exceptionArray.toString().replaceAll(","," , ");
        //console.log(msg);
        return Promise.reject(new Error(msg,{cause: {code: 400}}));
    }
  
}

async function removeCourse(id){
    const result = await Course.findByIdAndDelete(id);
    if (!result) return Promise.reject(new Error("The course with given id was not found",{cause: {code: 404}}));
    startupDebug(result);
    return result;
}

function validateCourse(course,crud){
    const schema = Joi.object({
        name : Joi.string().min(3).max(255).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional()
        }),
        category: Joi.string().required().valid('back-end','front-end'),
        author: Joi.string().min(3),
        tags: Joi.array().items(Joi.string()),
        date: Joi.date(),
        isPublished: Joi.boolean(),
        price: Joi.number().when('isPublished', { is: true, then: Joi.optional(), otherwise: Joi.optional()})
    }).tailor(crud);

    return schema.validate(course);
}


module.exports.getCourses= getCourses;
module.exports.getCourse= getCourse;
module.exports.updateCourse= updateCourse;
module.exports.createCourse= createCourse;
module.exports.removeCourse= removeCourse;
module.exports.validateCourse= validateCourse;