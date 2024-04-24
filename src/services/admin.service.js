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

module.exports = {
  getBestProfession
}
