const express = require('express')
const bodyParser = require('body-parser')
const { sequelize } = require('./model')

const contractsRoutes = require('./routes/contracts.routes')
const jobsRoutes = require('./routes/job.routes')
const accountRoutes = require('./routes/account.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()
app.use(bodyParser.json())

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use('/contracts', contractsRoutes)
app.use('/jobs', jobsRoutes)
app.use('/balances', accountRoutes)
app.use('/admin', adminRoutes)

module.exports = app
