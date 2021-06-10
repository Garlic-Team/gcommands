const mongoose = require('mongoose')

const user = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  guild: {
    type: String,
    required: false
  },
  cooldown: {
    type: Object,
    required: false
  }
})

module.exports = mongoose.model('user', user)