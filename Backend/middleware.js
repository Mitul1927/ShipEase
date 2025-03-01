const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const joi = require('joi');

const multer = require('multer');
const storage = multer.memoryStorage();
module.exports.upload = multer({ storage });

module.exports.authenticateUser = (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ msg: 'Token is not valid' });
    }
};
module.exports.authenticateAdmin = (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified.role==='admin') return res.status(403).json({ error: 'Forbidden' });

        req.user = verified;
        next();
    } catch (err) {
        return res.status(403).json({ msg: 'Token is not valid' });
    }
};
module.exports.shipmentSchema = joi.object({
    shipmentId: joi.string().required(),
    userId: joi.string().required(), 
    containerId: joi.string().required(),
    route: joi.array().items(
        joi.object({
            lat: joi.number().required(),
            lng: joi.number().required(),
            placeName : joi.string().required(),
        })
    ).required(),
    currentLocation: joi.object({
        lat: joi.number().required(),
        lng: joi.number().required(),
        placeName : joi.string().required(),
    }).required(),
    eta: joi.date().required(),
    status: joi.string().valid('Pending', 'In Transit', 'Delivered', 'Cancelled').required()
});
module.exports.userSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    username : joi.string()
});
// module.exports.getCoordinates = async(city)=>{
//     try{
//         const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
//             params: {
//                 q: city,
//                 key: process.env.GEOCODE_API_KEY 
//             }
//         });
//         if(response.data.length>0){
//             return response.data.results[0].geometry;
//         }else{
//             return null;
//         }
//     }catch(err){
//         console.error("error in getting coordinates",err);
//         return null;
//     }
// }