import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment configurations
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_contacts'

// Middlewares
app.use(cors())
app.use(express.json())

// Establish MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Successfully connected to MongoDB database.'))
  .catch((err) => console.error('✗ MongoDB connection failure:', err))

// Mongoose Contact Schema Design
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name field is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  subject: {
    type: String,
    trim: true,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Message field is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Contact = mongoose.model('Contact', ContactSchema)

// API Endpoint for Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    // Simple manual validation block
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required fields (Name, Email, Message).'
      })
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message
    })

    await newContact.save()

    return res.status(201).json({
      success: true,
      message: 'Contact details successfully recorded in the MongoDB database!',
      data: newContact
    })
  } catch (error) {
    console.error('API submission error:', error)
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while saving details.'
    })
  }
})

// Activate Server
app.listen(PORT, () => {
  console.log(`✓ Express API server is active on http://127.0.0.1:${PORT}`)
})
