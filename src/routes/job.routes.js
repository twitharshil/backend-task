const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getAllUnpaidJobsDetail } = require('../controllers/jobsController')

router.get('/unpaid', getProfile, getAllUnpaidJobsDetail)

module.exports = router
