const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const {authenticateUser} = require('../middleware');

const router = express.Router();
router.get('/shipments',shipmentController.getAllShipments);
router.get('/shipments/:id',shipmentController.getShipmentById);
router.get('/shipment/:id/eta',shipmentController.getShipmentETA);

router.post('/shipment',authenticateUser,shipmentController.createShipment);

router.put('/shipment/:id/updateLocation',authenticateUser,shipmentController.updateShipmentLocation);
router.put('/shipment/:id/updateStatus',authenticateUser,shipmentController.updateShipmentStatus);
router.put('/shipment/:id/updateETA',authenticateUser,shipmentController.updateShipmentETA);
router.put('/shipment/:id/updateStatus',authenticateUser,shipmentController.updateShipmentStatus);


router.delete('/shipment/:id',authenticateUser,shipmentController.deleteShipment);
module.exports = router; 