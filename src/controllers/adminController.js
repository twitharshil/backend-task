const adminService = require('../services/admin.service')

async function getBestProfession (req, res) {
  const { start, end } = req.query

  if (!start || !end) {
    return res.status(400).json({ message: 'Missing start date or end date' }).end()
  }

  try {
    const queryResult = await adminService.getBestProfession(start, end)

    return res.status(200).json({ message: `Best Profession is: ${queryResult}` }).end()
  } catch (err) {
    if (err.message === 'No profession found') {
      return res.status(400).json({ message: 'No profession found' }).end()
    }
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
};

async function getBestClient (req, res) {
  const { start, end, limit } = req.query

  if (!start || !end) {
    return res.status(400).json({ message: 'Missing or invalid parameters: start date, end date, limit' }).end()
  }

  try {
    const bestClients = await adminService.getBestClients(start, end, limit)

    const response = bestClients.map(client => ({
      id: client.id,
      fullName: `${client.firstName} ${client.lastName}`,
      paid: client.paid
    }))

    return res.status(200).json({ message: response }).end()
  } catch (err) {
    if (err.message === 'No client found') {
      return res.status(400).json({ message: 'No client found' }).end()
    }

    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  getBestProfession,
  getBestClient
}
