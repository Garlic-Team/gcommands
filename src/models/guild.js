const mongoose = require('mongoose')

const guild = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: false
  }
})

module.exports = mongoose.model('guild', guild)