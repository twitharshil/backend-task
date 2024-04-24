const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getBestProfession, getBestClient } = require('../controllers/adminController')

router.get('/best-profession', getProfile, getBestProfession)
router.get('/best-clients', getProfile, getBestClient)

module.exports = router
