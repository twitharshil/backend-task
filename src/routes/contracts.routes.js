const express = require('express')
const router = express.Router()

const { getProfile } = require('../middleware/getProfile')
const { getContractsById, getAllContracts } = require('../controllers/contractController')

/**
 * It is fixed :)
 * @returns contract by id
 */
router.get('/:id', getProfile, getContractsById)
router.get('/', getProfile, getAllContracts)

module.exports = router
