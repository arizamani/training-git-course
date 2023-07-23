const startupDebug = require("debug")("app:startup");
const config = require("config");
const db = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcryptjs");
const Joi = require("joi"); 

//Database Schema
const userSchema = new db.Schema({
    name: {
        type: String,
        required: '{PATH} is required!',
        minlength:5,
        maxlength: 255,
    },
    date: {
        type: Date,
        default: Date.now
    },
    email:{
        type: String, 
        required: '{PATH} is required!',
    },
    password: {
        type: String, 
        required: '{PATH} is required!',
    }
});

//Costnat
const 
    User = db.model("User", userSchema);
    //errorId = new Error("The user with given id was not found",{cause: {code: 404}});
    //errorAuth = new Error("The Email or pssword is ivalid",{cause: {code: 400}});

//Function
async function getUsers(){
    const result = await User.find()
    .limit(10).
    sort({name:1}).
    select({name:1 , email:1});
    startupDebug(result);
    return result;
} 

async function getUser(id){
    const user = await User.findById(id);
    if (!user) return Promise.reject(errorId);

    startupDebug(user);
    return user;
}

async function updateUser(id,userObj){
    const user = await User.findByIdAndUpdate(id,{$set: userObj},{new: true});
    if (!user) return Promise.reject(errorId);

    startupDebug(user);
    return user;
} 

async function createUser(userObj){
    const registeredUser = await User.findOne().or([{name: userObj.name},{email: userObj.email}]);
    if (!registeredUser || registeredUser == null){
        const user = new User(_.pick(userObj,['name','email','date','password']));
        try{
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password,salt);
            const result = await user.save();
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
            return Promise.reject(new Error(msg,{cause: {code: 400}}));
        }
    }else{
       return Promise.reject(new Error("The user with given name or email was registerd",{cause: {code: 403}}));
    }  
}

async function removeUser(id){
    const result = await User.findByIdAndDelete(id);
    if (!result) return Promise.reject(errorId);
    startupDebug(result);
    return result;
}

//Validation
function validateUser(user,crud){
    const schema = Joi.object({
        name : Joi.string().min(3).max(255).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional()
        }).alphanum(),
        date: Joi.date(),
        email: Joi.string().email().required(),//regex(/[@]/)
        password: Joi.string().min(6).max(255).alter({
            post: (schema) => schema.required(),
            put: (schema) => schema.optional()
        })
        .ruleset.pattern(/^[^\\/\^:;=\<>+*]+$/)
        .message("for password field the Characters: [ ^, /, \\, :, ;, <, >, =, +, * ] is not valid!")
        .ruleset.pattern(/^([\d\w\S]*[A-Z]+[\d\w\S]*){3}$/)
        .message("Atleast 3 Capital character is needed!")
        .ruleset.custom(function(value, helpers){
            let counter = 0; 
            for (let i = 0; i < 10; i++) {
                let expression = `${i}`;
                let regex = new RegExp(expression, 'ig');
                let result = value.match(regex);
                if (result!= null && result.length>3){
                    counter++;
                }
            }
            if (counter>0){
                throw new Error("Not include");  
            }else{
                return value;
            }
        }).message("You couldn't use more than 3 repeated Digit!")
    }).tailor(crud);

    return schema.validate(user);
}

module.exports.User = User;
module.exports.getUsers= getUsers;
module.exports.getUser= getUser;
module.exports.updateUser= updateUser;
module.exports.createUser= createUser;
module.exports.removeUser= removeUser;
module.exports.validateUser= validateUser;

//(/^(([^2])*(2)?([^2])*){1,3}$/)
//^\w*(\d)\w*\1\w*\1\w*$