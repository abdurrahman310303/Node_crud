const mongoose= require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String, 
        required:true,
    },
    email:{
        type:String, 
        required:true,
    },
    phone:{
        type:String, 
        required:true,
    },
    image:{
        type:String, 
        required:true,
    },
    ctreated:{
        type:Date, 
        required:true,
        default:Date.now,
    },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
