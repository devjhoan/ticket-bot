const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema ({
    guildID: String,
    roles: {
        staffRole: String,
        adminRole: String,
    },
    tickets: Array,
    usersBlacklisted: Array,
    ticketCounter: Number,
    channelLog: String,
    channelTranscript: String,
    reactionData: {
        channel: String,
        message: String,
    }
})

module.exports = mongoose.model('ticketSchema', ticketSchema)