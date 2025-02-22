const express = require('express');
const Shipment = require('../models/Shipment');
const joi = require('joi');
const {shipmentSchema,getCoordinates} = require('../middleware');
const {v4:uuid4}  = require('uuid');

module.exports.getAllShipments = async(req,res)=>{
        try {
            const shipments = await Shipment.find({});
            res.json(shipments);
        } catch (error) {
            console.error("error in finding all shipments",error);
            res.status(500).send('Server Error');
        }
}
module.exports.getShipmentById = async(req,res)=>{
    try {
        const shipment = await Shipment.findById(req.params.id);
        if(!shipment){
            return res.status(404).send('Shipment not found by id');
        }
        res.json(shipment);
    } catch (error) {
        console.error("error in finding shipment by id",error);
        res.status(500).send('Server Error');
    }
}
module.exports.createShipment = async(req,res)=>{
    try{
        const {error} = shipmentSchema.validate(req.body);
        if(error) return res.status(400).json({ error: `error in validation ${error.details[0].message}` });

        const shipment = new Shipment({...req.body,shipmentId:uuid4()});
        await shipment.save();
        res.status(201).json(shipment);
    }catch(error){
        console.error("error in creating shipment",error);
        res.status(400).send('Invalid data');
    }
};

module.exports.updateShipmentLocation = async(req,res)=>{
    try{
        const {lat,lng} = req.body;
        const shipment = await Shipment.findByIdAndUpdate(req.params.id,{$set:{currentLocation:{lat,lng}}},{new:true});
        res.json(shipment);
    }catch(error){
        console.error("error in updating shipment location",error);
        res.status(400).send('Invalid data');
    }
}
module.exports.updateShipmentStatus = async(req,res)=>{
    try{
        const {status} = req.body;
        const shipment = await Shipment.findByIdAndUpdate(req.params.id,{$set:{status}},{new:true});
        res.json(shipment);
    }catch(error){
        console.error("error in updating shipment status",error);
        res.status(400).send('Invalid data');
    }
}
module.exports.updateShipmentETA = async(req,res)=>{
    try{
        const {eta} = req.body;
        const etaSchema = joi.object({
            eta: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
        });
        const {error} = etaSchema.validate({eta});
        if(error) return res.status(400).json({ error: `error in validation date ${error.details[0].message}` });

        const shipment = await Shipment.findByIdAndUpdate(req.params.id,{$set:{eta}},{new:true});
        if(!shipment) return res.status(404).json({ error: `shipment not found` });
        res.json({"message":"ETA updated successfully",shipment});
    }catch(error){
        console.error("error in updating shipment eta",error);
        res.status(400).send('Invalid data');
    }
}
module.exports.updateShipmentStatus = async(req,res) =>{
    try{
        const {status} = req.body;
        const statusSchema = joi.object({
            status : joi.string().valid('Delivered','In Transit','Pending','Cancelled').required()
        }
        )
        const {error} = statusSchema.validate({status});
        if(error) return res.status(400).json({ error: `error in validation status ${error.details[0].message}` });

        const shipment = await Shipment.findByIdAndUpdate(req.params.id,{$set:{status}},{new:true});
        if(!shipment) return res.status(404).json({error : 'Shipment not found during status update'});
        res.json({shipment,message : 'Status updated successfully'});
    }catch(error){
        console.error("error in updating shipment status",error);
        res.status(500).send('Server Error');
    }
}
module.exports.getShipmentETA = async(req,res)=>{
    try{
        const shipment = await Shipment.findById(req.params.id);
        if(!shipment) return res.status(404).json({error : 'shipment not found during eta shipment'});
        res.json({eta : shipment.eta});
    }catch(error){
        console.error("error in getting shipment eta",error);
        res.status(500).send('Server Error');
    }
}
module.exports.deleteShipment = async(req,res)=>{
    try{
        const shipment = await Shipment.findByIdAndDelete(req.params.id);
        if(!shipment) return res.status(404).json({error : 'Shipment not found during deletion'});
        res.json({shipment,message : 'shipment deleted successfully'});
    }catch(error){
        console.error("error in deleting shipment",error);
        res.status(500).send('Server Error');
    }
}