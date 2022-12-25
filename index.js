const axios = require('axios')
const bodyParser = require('body-parser')
const express = require('express')
const moment = require('moment-timezone')

require('dotenv').config()

if (!process.env.CLOCKIFY_PROJECT_CREATED_SECRET && !process.env.CLOCKIFY_CLIENT_CREATED_SECRET && !CLOCKIFY_TIME_ANY_CREATED_SECRET) {
  throw new Error("Error! You must specify ️CLOCKIFY_SIGING_SECRET")
}

if (!process.env.SLACK_HOOK) {
  throw new Error("Error! You must specify SLACK_HOOK")
}

const app = express()
const PORT = 3000
app.use(bodyParser.json())

app.post('/clockify/timer/start', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_CREATED_SECRET) {
    console.log('New Time Entry from Clockify!')
    console.log(req.body)
    const { user, project, description, timeInterval } = req.body

    const time = moment.tz(timeInterval.start, process.env.TIMEZONE)
    const start_time = time.format('YYYY/MM/DD hh:mm:ss A')

    res.status(200).end()

    await sendMessageToSlackChannel(`:arrow_forward: *${user.name}* started timer for *${project?.name}* at *${start_time}* \n       Description: *${description}* `)
  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('/clockify/timer/stop', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_STOP_SECRET) {
    console.log('A Time Entry Stoped!')
    console.log(req.body)
    const { user, project, description, timeInterval } = req.body

    const starttime = moment.tz(timeInterval.start, process.env.TIMEZONE)
    const endtime = moment.tz(timeInterval.end, process.env.TIMEZONE)
    const start_time = starttime.format('YYYY/MM/DD hh:mm:ss A')
    const stop_time = endtime.format('YYYY/MM/DD hh:mm:ss A')

    const duration = moment.duration(timeInterval.duration);

    res.status(200).end()

    await sendMessageToSlackChannel(`:black_square_for_stop: *${user.name}* stoped timer for *${project?.name}* at *${stop_time}* \n       Description: *${description}* \n      Duration: *${duration.humanize()}* `)
  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('/clockify/timer/manually-created', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_CREATED_SECRET) {
    console.log('A Time Entry Manually Created!')
    console.log(req.body)

    res.status(200).end()

  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('/clockify/timer/manually-updated', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_UPDATED_SECRET) {
    console.log('A Time Entry Manually Updated!')
    console.log(req.body)

    res.status(200).end()

  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('/clockify/timer/deleted', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_DELETED_SECRET) {
    console.log('A Time Entry Deleted!')
    console.log(req.body)

    res.status(200).end()

  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('clockify/projects/new', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_PROJECT_CREATED_SECRET) {
    console.log('New project from Clockify!')
    console.log(req.body)
    const { name, clientName } = req.body
    res.status(200).end()

    await sendMessageToSlackChannel(`:clap: A new project has been created with name *${name}* for client *${clientName}*!`)
  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.post('/clockify/clients/new', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_CLIENT_CREATED_SECRET) {
    console.log('New client from Clockify!')
    console.log(req.body)
    const { name } = req.body
    res.status(200).end()

    await sendMessageToSlackChannel(`:muscle: The new client *${name}* has been added to Clockify!`);
  } else {
    console.log('Unauthorized')
    res.status(401).json({message: 'Unauthorized'}).end()
  }
})

app.listen(PORT, '127.0.0.1', () => console.log(`🚀 Server running on port ${PORT}`))

async function sendMessageToSlackChannel(text) {
  try {
    await axios.post(process.env.SLACK_HOOK, { text })
    console.log('Message sent to Slack webhook!')
  } catch (e) {
    console.log('Error sending message to Slack webhook!')
    console.error(e)
  }
}
