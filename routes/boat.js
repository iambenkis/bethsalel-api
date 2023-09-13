const express = require('express')
const router = express.Router()

const BoatController = require('../controllers/BoatController')
const upload = require('../middleware/upload')

router.get('/', BoatController.index)
router.post('/show', BoatController.show)
router.post('/store', upload.single('image'), BoatController.store)
router.post('/update', BoatController.update)
router.post('/delete', BoatController.destroy)

module.exports = router
