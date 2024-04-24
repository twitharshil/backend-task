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

module.exports = {
  getContractDetailsByID
}
