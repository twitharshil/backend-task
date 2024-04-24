const { getAllContracts, getContractDetailsByID } = require('../src/services/contract.services.js')

jest.mock('../src/model.js', () => {
  const mockContracts = [
    {
      id: 1,
      terms: 'sample terms 1',
      status: 'terminated',
      ClientId: 3,
      ContractorId: 1
    },
    {
      id: 2,
      terms: 'sample terms 2',
      status: 'in_progress',
      ClientId: 3,
      ContractorId: 2
    }
  ]

  return {
    Contract: {
      findAll: jest.fn().mockReturnValue(Promise.resolve(mockContracts)),
      findOne: jest.fn((options) => {
        return Promise.resolve(
          mockContracts.find((contract) => contract.id === options.where.id)
        )
      })
    }
  }
})

describe('Contract Endpoints Tests', () => {
  it('should find a contract with given contract Id and user Id', async () => {
    const contract = await getContractDetailsByID(1, 3)
    expect(contract).toBeDefined()
    expect(contract.id).toBe(1)
    expect(contract.ClientId).toBe(3)
    expect(contract.ContractorId).toBe(1)
  })

  it('should get all active contracts for a user', async () => {
    const contracts = await getAllContracts(3)
    expect(contracts).toBeDefined()
    expect(contracts.length).toBe(2)
    expect(contracts[0].id).toBe(1)
    expect(contracts[1].id).toBe(2)
  })
})
