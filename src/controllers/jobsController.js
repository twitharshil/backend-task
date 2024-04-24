const jobService = require('../services/jobs.service')

async function getAllUnpaidJobsDetail (req, res) {
  try {
    const unPaidJobDetails = await jobService.getUnpaidJobDetails(req.profile.id)
    return res.status(200).json(unPaidJobDetails).end()
  } catch (err) {
    if (err.message === 'Failed to find unpaid jobs') {
      return res.status(404).json({ message: 'No unpaid jobs found' }).end()
    }
    console.log(err)
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  getAllUnpaidJobsDetail
}
