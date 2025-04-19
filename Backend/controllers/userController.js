const User = require('../models/user');
const Shipment = require('../models/Shipment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const {userSchema} = require('../middleware');
const cloudinary = require('../utils/cloudinaryConfig'); 
const {upload} = require("../middleware");
const multer = require('multer');

// const storage = multer.memoryStorage();
// const upload = multer({ storage });
dotenv.config();



module.exports.signup = async (req, res) => {
    try {
        upload.single("image")(req, res, async function (err) {
            if (err) return res.status(400).json({ error: "Error uploading image" });
            const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

            const { email, password,username } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: "User already exists" });

            let imageUrl = null;

            if (req.file) {
                const result = await cloudinary.uploader.upload_stream(
                    { folder: "user_profiles", resource_type: "image" },
                    async (error, result) => {
                        if (error) {
                            return res.status(500).json({ error: "Cloudinary upload failed" });
                        }

                        imageUrl = result.secure_url;
                        const newUser = new User({ email, password, image: imageUrl,username:username });
                        await newUser.save();
                        const token = jwt.sign(
                            { id: newUser._id, email: newUser.email, role: newUser.role, image: imageUrl,username:username },
                            process.env.JWT_SECRET,
                            { expiresIn: "1d" }
                        );
                        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie("userId", newUser._id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie("email", newUser.email, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie("role", newUser.role, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                        res.cookie("image", newUser.image, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });

                        return res.status(201).json({ message: "User registered successfully", token });
                    }
                );

                result.end(req.file.buffer); 
            } else {
                const newUser = new User({ email, password,username });
                await newUser.save();

                const token = jwt.sign({ id: newUser._id, email: newUser.email, role: newUser.role,image:newUser.image,username:newUser.username }, process.env.JWT_SECRET, { expiresIn: "1d" });

                res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                res.cookie("userId", newUser._id, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                res.cookie("email", newUser.email, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                res.cookie("role", newUser.role, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 });
                res.cookie('image',newUser.image,{httpOnly: true, secure: true,sameSite:'none',maxAge: 24 * 60 * 60 * 1000});

                return res.status(201).json({ message: "User registered successfully", token });
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Error in signing up", err });
    }
};
module.exports.login = async (req, res) => {
    try {
        const { error } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Wrong password' });
        // console.log(user.image);
        const token = jwt.sign({ id: user._id,email : user.email, role: user.role,image:user.image,username:user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('userId', user._id, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('email', user.email, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('role', user.role, { httpOnly: true, secure: true , sameSite: 'none', maxAge: 24 * 60 * 60 * 1000})
        res.cookie('image',user.image, { httpOnly: true, secure: true,sameSite: 'none', maxAge: 24 * 60 * 60 * 1000})
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
    res.clearCookie('image');
    res.json({ message: 'Logged out successfully' });
}

module.exports.myShipments = async(req,res)=>{
    try {
        const id = req.user.id;
        // console.log(id);
        const user = await User.findById(id);
        const shipmentIds = user.shipments;
        if (!shipmentIds || shipmentIds.length === 0) {
            return res.status(404).json({ msg: "No shipments found." });
        }
        const shipments = await Shipment.find({ _id: { $in: shipmentIds } });

        res.json(shipments); 
    } catch (error) {
        console.error("Error fetching user shipments:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports.reset = async (req,res)=> {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ error: "Email and new password are required" });
        }
    
        // Find user by email
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // // Hash new password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
    
        // Update password in the database
        // user.password = hashedPassword;
        user.password = password;
        await user.save();
    
        return res.status(200).json({ msg: "Password reset successfully" });
    
      } catch (e) {
        console.error("Error in resetting password", e);
        res.status(500).json({ error: "Error in resetting password", e });
      }
}