const { Job, Contract, Op } = require('../model')

/**
     * Find all unpaid jobs belong to a user (either a contractor or client)
     * @param profileId
     * returns a result object
     *
**/
async function getUnpaidJobDetails (userID) {
  const queryResult = await Job.findAll({
    include: [{
      model: Contract,
      attributes: [],
      where: {
        [Op.or]: [
          { ClientId: userID },
          { ContractorId: userID }
        ],
        status: 'in_progress'
      }
    }],
    where: {
      paid: null
    }
  })

  if (!queryResult) {
    throw new Error('Failed to find unpaid jobs')
  }

  return queryResult
}

module.exports = {
  getUnpaidJobDetails
}
