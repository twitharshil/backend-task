const accountService = require('../services/account.service')

async function depositBalance (req, res) {
  const { userId } = req.params
  const { depositAmount } = req.body

  if (!depositAmount || !userId) {
    return res.status(400).json({ message: 'Deposit amount or user id is missing' }).end()
  }

  try {
    await accountService.depositBalance(userId, depositAmount)
    return res.status(200).json({ message: 'Amount deposited successfully' }).end()
  } catch (err) {
    if (err.message === 'No amount needed to be paid for any job') {
      return res.status(400).json({ message: 'No amount needed to be paid for any job' }).end()
    }

    if (err.message === 'Deposit amount is higher than 25% of total pay') {
      return res.status(400).json({ message: 'Deposit amount is higher than 25% of total pay' }).end()
    }

    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  depositBalance
}
