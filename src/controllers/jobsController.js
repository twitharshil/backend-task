const jobService = require('../services/jobs.service')

async function getAllUnpaidJobsDetail (req, res) {
  try {
    const unPaidJobDetails = await jobService.getUnpaidJobDetails(req.profile.id)
    return res.status(200).json(unPaidJobDetails).end()
  } catch (err) {
    if (err.message === 'No unpaid jobs found') {
      return res.status(404).json({ message: 'No unpaid jobs found' }).end()
    }
    console.log(err)
    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

async function payForJob (req, res) {
  const { jobId } = req.params

  if (!jobId) {
    return res.status(400).json({ message: 'Job id is missing' }).end()
  }

  try {
    const paymentResult = await jobService.payForJob(jobId, req.profile.id)

    if (!paymentResult.success) {
      return res.status(400).json({ message: paymentResult.message }).end()
    }

    return res.status(200).json({ message: paymentResult.message }).end()
  } catch (err) {
    if (err.message === `Failed to find unpaid job with profile_id: ${req.profile.id} and jobId: ${jobId}`) {
      return res.status(404).json({ message: err.message }).end()
    } else if (err.message === "The client doesn't have enough money to pay for this job") {
      return res.status(402).json({ message: err.message }).end()
    }

    return res.status(500).json({ message: 'Internal server error' }).end()
  }
}

module.exports = {
  getAllUnpaidJobsDetail,
  payForJob
}
