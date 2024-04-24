const { Profile, Job, Contract, Op, sequelize } = require('../model')

/**
     * Find all unpaid jobs belong to a user (either a contractor or client)
     * @param profileId
     * returns a result object
     *
**/
async function getUnpaidJobDetails (profileId) {
  const queryResult = await Job.findAll({
    include: [{
      model: Contract,
      attributes: [],
      where: {
        [Op.or]: [
          { ClientId: profileId },
          { ContractorId: profileId }
        ],
        status: 'in_progress'
      }
    }],
    where: {
      paid: null
    }
  })

  if (!queryResult || queryResult.length === 0) {
    throw new Error('Failed to find unpaid jobs');
  }

  return queryResult
}

/**
     * Pay for a job
     * @param jobId
     * @param profileId
     * returns a result object
**/
async function payForJob (jobId, profileId) {
  try {
    const queryResult = await Job.findOne({
      attributes: ['price', [sequelize.literal('Contract.ContractorId'), 'ContractorId']],
      where: {
        id: jobId,
        paid: null
      },
      include: [{
        model: Contract,
        attributes: [],
        where: {
          status: 'in_progress',
          ClientId: profileId
        }
      }]
    })

    if (!queryResult) {
      throw new Error('Failed to find unpaid job with profile_id: ' + profileId + ' and jobId: ' + jobId)
    }

    const jobPrice = queryResult.dataValues.price
    const jobContractorId = queryResult.dataValues.ContractorId

    const userInfo = await Profile.findOne({
      attributes: ['balance'],
      where: {
        id: profileId
      }
    })

    const userBalance = userInfo.dataValues.balance

    if (userBalance < jobPrice) {
      throw new Error("The client doesn't have enough money to pay for this job")
    }

    await sequelize.transaction(async (t) => {
      await Profile.update(
        { balance: sequelize.literal(`balance - ${jobPrice}`) },
        { where: { id: profileId }, transaction: t }
      )

      await Profile.update(
        { balance: sequelize.literal(`balance + ${jobPrice}`) },
        { where: { id: jobContractorId }, transaction: t }
      )

      await Job.update(
        { paid: true, paymentDate: new Date() },
        { where: { id: jobId }, transaction: t }
      )
    })

    return { success: true, message: 'Payment done successfully' }
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  getUnpaidJobDetails,
  payForJob
}
