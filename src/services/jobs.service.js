const { Profile, Job, Contract, Op, sequelize } = require('../model')

/**
 * Find all unpaid jobs belonging to a user (either a contractor or client).
 * @param {number} profileId - The ID of the user profile.
 * @returns {Array} - An array of unpaid job objects.
 * @throws {Error} - If no unpaid jobs are found.
 */
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
    throw new Error('No unpaid jobs found')
  }

  return queryResult
}

/**
 * Pay for a job.
 * @param {number} jobId - The ID of the job to be paid for.
 * @param {number} profileId - The ID of the user profile making the payment.
 * @returns {object} - A result object indicating the success or failure of the payment.
 * @throws {Error} - If the payment fails for any reason.
 */
async function payForJob (jobId, profileId) {
  try {
    await sequelize.transaction(async (t) => {
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
        }],
        transaction: t
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
        },
        transaction: t
      })

      const userBalance = userInfo.dataValues.balance

      if (userBalance < jobPrice) {
        throw new Error("The client doesn't have enough money to pay for this job")
      }

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
