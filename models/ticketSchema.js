const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema ({
    guildID: String,
    roles: {
        staffRole: String,
        adminRole: String,
    },
    tickets: Array,
    ticketCounter: Number,
    channelLog: String,
    channelTranscript: String,
})

module.exports = mongoose.model('ticketSchema', ticketSchema)