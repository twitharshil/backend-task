const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getContractsByID, getAllContracts } = require('../controllers/contractController')

/**
 * It is fixed :)
 * @returns contract by id
 */
router.get('/:id', getProfile, getContractsByID)
router.get('/', getProfile, getAllContracts)

module.exports = router
