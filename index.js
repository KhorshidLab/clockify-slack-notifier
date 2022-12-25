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

app.post('/clockify/timer/new', async (req, res) => {
  const clockifySignature = req.header('clockify-signature')
  if (clockifySignature === process.env.CLOCKIFY_TIME_ANY_CREATED_SECRET) {
    console.log('New Time Entry from Clockify!')
    console.log(req.body)
    const { user, project, timeInterval } = req.body

    const time = moment.tz(timeInterval.start, process.env.TIMEZONE)
    const start_time = time.format('YYYY/MM/DD hh:mm A')

    res.status(200).end()

    await sendMessageToSlackChannel(`:arrow_forward: *${user.name}* started timer for *${project?.name}* at *${start_time}*`)
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
