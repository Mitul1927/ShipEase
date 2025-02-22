const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const {userSchema} = require('../middleware');
dotenv.config();



module.exports.signup = async(req,res)=>{
    try{
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, password });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id,email:newUser.email, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('userId', newUser._id, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('email', newUser.email, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('role',newUser.role, { httpOnly: true, secure: true, sameSite: 'none',maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ message: 'User registered successfully', token });
    }catch(err){
    res.status(500).json({ error: 'error in signing up', err });
    }
}
module.exports.login = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong password' });
        const token = jwt.sign({ id: user._id,email : user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('userId', user._id, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('email', user.email, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('role', user.role, { httpOnly: true, secure: true , sameSite: 'none', maxAge: 24 * 60 * 60 * 1000})
        res.json({ token });
    } catch (err) {
        console.log("error in logging in",err);
        res.status(500).json({ error: "Error in logging in", err });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('userId');
    res.clearCookie('email');
    res.clearCookie('role');
    res.json({ message: 'Logged out successfully' });
}