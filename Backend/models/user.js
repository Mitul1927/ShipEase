const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {type: String,required : true, unique : true},
    username : {type:String,required : true},
    password : {type: String},
    role : {type : String, enum:['user','admin'], default:'user'},
    image : {type : String,default:null},
    googleId: { type: String },
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password') || !this.password){
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});
module.exports = mongoose.model('User',userSchema);