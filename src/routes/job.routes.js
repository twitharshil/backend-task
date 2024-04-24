const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getAllUnpaidJobsDetail, payForJob } = require('../controllers/jobsController')

router.get('/unpaid', getProfile, getAllUnpaidJobsDetail)
router.post('/:jobId/pay', getProfile, payForJob)

module.exports = router
