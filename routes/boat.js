const express = require('express');
const router = express.Router();

const BoatController = require('../controllers/BoatController');

router.get('/', BoatController.index);
router.post('/show', BoatController.show);
router.post('/store', BoatController.store);
router.post('/update', BoatController.update);
router.post('/delete', BoatController.destroy);

module.exports = router;