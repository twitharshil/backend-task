const { Profile, Job, Contract, sequelize, Op } = require('../model')

// Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
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

  if (!queryResult) {
    throw new Error('No client found')
  }

  return queryResult
}

module.exports = {
  getBestProfession,
  getBestClients
}
