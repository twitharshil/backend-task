const { Profile, Job, Contract, sequelize } = require('../model')

/**
   * Deposit amount in client account
   * @param userId - ID of the user
   * @param depositAmount - Amount to deposit
**/
async function depositBalance (userId, depositAmount) {
  await sequelize.transaction(async (t) => {
    const queryResult = await Profile.findOne({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('price')), 'totalAmount']
      ],
      where: {
        id: userId,
        type: 'client'
      },
      include: [
        {
          model: Contract,
          as: 'Client',
          attributes: [],
          required: true,
          include: [
            {
              model: Job,
              attributes: [],
              required: true,
              where: {
                paid: null
              }
            }
          ]
        }
      ],
      transaction: t
    })

    const totalAmountToPay = queryResult.dataValues.totalAmount

    if (!totalAmountToPay) {
      throw new Error('No amount needed to be paid for any job')
    }

    if (depositAmount > totalAmountToPay * 0.25) {
      throw new Error('Deposit amount is higher than 25% of total pay')
    }

    await Profile.update(
      { balance: sequelize.literal(`balance + ${depositAmount}`) },
      { where: { id: userId }, transaction: t }
    )
  })
}

module.exports = {
  depositBalance
}
