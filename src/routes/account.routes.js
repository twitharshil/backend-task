const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { depositBalance } = require('../controllers/accountController')

router.post('/deposit/:userId', getProfile, depositBalance)

module.exports = router
