const { Contract } = require('../model')
const { Op } = require('sequelize')

/**
 * Retrieve details of a contract by its ID.
 * @param {number} contractId - The ID of the contract.
 * @param {number} profileId - The ID of the user profile.
 * @returns {object} - The details of the contract.
 * @throws {Error} - If no contract is found.
 */
async function getContractDetailsById (contractId, profileId) {
  const queryResult = await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: {
        ClientId: profileId,
        ContractorId: profileId
      }
    }
  })

  if (!queryResult) {
    throw new Error('No contract found')
  }

  console.log(typeof queryResult)
  return queryResult
}

/**
 * Find all contracts belonging to a user (client or contractor) that are active.
 * @param {number} userId - The ID of the user profile.
 * @returns {Array} - An array of contract objects.
 * @throws {Error} - If no contracts are found.
 */
async function getAllContracts (userId) {
  const queryResult = await Contract.findAll({
    where: {
      status: ['in_progress', 'new'],
      [Op.or]: [
        { ClientId: userId },
        { ContractorId: userId }
      ]
    }
  })

  if (!queryResult || queryResult.length === 0) {
    throw new Error('No contracts found')
  }

  return queryResult
}

module.exports = {
  getContractDetailsById,
  getAllContracts
}
