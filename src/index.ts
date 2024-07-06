import express from 'express'
import mongoose from 'mongoose'

import { config } from 'dotenv'
import { indexRouter } from './routes'

const app = express()
const PORT = process.env.PORT || 8000

config()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', indexRouter)
initialize()

async function initialize() {
  try {
    await mongoose.connect(process.env.MONGO_URI!)
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  } catch (error) {
    console.error(error)
  }
}
