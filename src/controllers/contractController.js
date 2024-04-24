const contractService = require('../services/contract.services')

async function getContractsByID (req, res) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'Contract id is missing' }).end()
  }

  try {
    const contract = await contractService.getContractDetailsByID(id, req.profile.id)
    return res.status(200).json(contract).end()
  } catch (err) {
    if (err.message === 'No contract found') {
      return res.status(404).json({ message: 'No contract found' }).end()
    }
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  getContractsByID
}