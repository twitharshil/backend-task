const { Contract } = require('../model')
const { Op } = require('sequelize')

/**
     * Find a contract by contract id and profile id
     * @param contractId
     * @param profileId
     * returns a result object
**/
async function getContractDetailsByID (contractId, profileId) {
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

  return queryResult
}

/**
     * Find all the contracts belong to a userID (Client or contractor) which are active
     * @param profileId
     * returns a result object
**/

async function getAllContracts (userID) {
  const queryResult = await Contract.findAll({
    where: {
      status: ['in_progress', 'new'],
      [Op.or]: [
        { ClientId: userID },
        { ContractorId: userID }
      ]
    }
  })

  if (!queryResult) {
    throw new Error('No contracts found')
  }

  return queryResult
}

module.exports = {
  getContractDetailsByID,
  getAllContracts
}
