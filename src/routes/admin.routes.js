const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getBestProfession } = require('../controllers/adminController')

router.get('/best-profession', getProfile, getBestProfession)

module.exports = router
