const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getContractsByID } = require('../controllers/contractController')

/**
 * It is fixed :)
 * @returns contract by id
 */
router.get('/:id', getProfile, getContractsByID)

module.exports = router
