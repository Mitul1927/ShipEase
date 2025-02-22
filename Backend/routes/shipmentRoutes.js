const express = require('express');
const shipmentController = require('../controllers/shipmentController');
const {authenticateAdmin} = require('../middleware');

const router = express.Router();
router.get('/shipments',shipmentController.getAllShipments);
router.get('/shipments/:id',shipmentController.getShipmentById);
router.get('/shipment/:id/eta',shipmentController.getShipmentETA);

router.post('/shipment',authenticateAdmin,shipmentController.createShipment);

router.put('/shipment/:id/updateLocation',authenticateAdmin,shipmentController.updateShipmentLocation);
router.put('/shipment/:id/updateStatus',authenticateAdmin,shipmentController.updateShipmentStatus);
router.put('/shipment/:id/updateETA',authenticateAdmin,shipmentController.updateShipmentETA);
router.put('/shipment/:id/updateStatus',authenticateAdmin,shipmentController.updateShipmentStatus);


router.delete('/shipment/:id',authenticateAdmin,shipmentController.deleteShipment);
module.exports = router; 