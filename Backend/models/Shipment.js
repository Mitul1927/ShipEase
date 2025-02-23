const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId,ref : 'User',required : true},
    shipmentId : {type : String, required : true,unique : true},
    containerId : {type : String,unique:true, required : true},
    route : [{
        lat: {type : Number, required : true},
        lng: {type : Number, required : true},
    }],
    currentLocation : {
        lat : {type: Number, required : true},
        lng:{ type: Number,required:true}
    },
    eta : {type : Date,required : true},
    status : {type : String, enum : ['Pending', 'In Transit', 'Delivered', 'Cancelled'], default : 'Pending'}
},{ timestamps: true });
module.exports = mongoose.model('Shipment',ShipmentSchema);