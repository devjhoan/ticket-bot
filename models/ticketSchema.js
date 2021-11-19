const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema ({
    guildID: String,
    tickets: Array,
    channelLog: String,
    channelTranscript: String,
})

module.exports = mongoose.model('ticketSchema', ticketSchema)