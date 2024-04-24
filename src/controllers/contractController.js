const contractService = require('../services/contract.services')

async function getContractsById (req, res) {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ message: 'Contract id is missing' }).end()
  }

  try {
    const contract = await contractService.getContractDetailsById(id, req.profile.id)
    return res.status(200).json(contract).end()
  } catch (err) {
    if (err.message === 'No contract found') {
      return res.status(404).json({ message: 'No contract found' }).end()
    }
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

async function getAllContracts (req, res) {
  try {
    const contracts = await contractService.getAllContracts(req.profile.id)
    return res.status(200).json(contracts).end()
  } catch (err) {
    if (err.message === 'No contracts found') {
      return res.status(404).json({ message: 'No contracts found' }).end()
    }
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  getContractsById,
  getAllContracts
}
