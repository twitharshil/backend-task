const { Profile, Job, Contract, sequelize, Op } = require('../model')

/**
 * Find the best profession based on earnings within a specified date range.
 * @param {Date} start - Start date of the query.
 * @param {Date} end - End date of the query.
 * @returns {string} - The best profession.
 */
async function getBestProfession (start, end) {
  const queryResult = await Profile.findOne({
    attributes: ['Profession'],
    where: {
      type: 'contractor'
    },
    include: [{
      model: Contract,
      as: 'Contractor',
      required: true,
      include: [{
        model: Job,
        attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'earned']],
        where: {
          paid: true,
          paymentDate: {
            [Op.between]: [new Date(start), new Date(end)]
          }
        },
        group: ['ContractId'],
        order: [[sequelize.literal('earned'), 'DESC']]
      }]
    }]
  })

  if (!queryResult || !queryResult.dataValues || !queryResult.dataValues.Profession) {
    throw new Error('No profession found')
  }

  return queryResult.dataValues.Profession
}

/**
 * Find the best-paying clients within a specified date range.
 * @param {Date} start - Start date of the query.
 * @param {Date} end - End date of the query.
 * @param {number} limit - Limit of the number of clients to retrieve.
 * @returns {Array} - An array of best-paying clients.
 */
async function getBestClients (start, end, limit) {
  const queryResult = await Profile.findAll({
    attributes: [
      'id',
      'firstName',
      'lastName',
      [sequelize.fn('SUM', sequelize.col('price')), 'paid']
    ],
    include: [
      {
        model: Contract,
        as: 'Client',
        attributes: [],
        required: true,
        include: [
          {
            model: Job,
            required: true,
            attributes: [],
            where: {
              paid: true,
              paymentDate: {
                [Op.between]: [new Date(start), new Date(end)]
              }
            }
          }
        ]
      }
    ],
    where: {
      type: 'client'
    },
    group: ['firstName', 'lastName'],
    order: [[sequelize.col('paid'), 'DESC']],
    limit: limit || 2,
    subQuery: false
  })

  if (!queryResult || queryResult.length === 0) {
    throw new Error('No client found')
  }

  return queryResult
}

module.exports = {
  getBestProfession,
  getBestClients
}
