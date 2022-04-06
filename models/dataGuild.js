const mongoose = require('mongoose')

const guildData = new mongoose.Schema({
    guildID: String,
    tickets: Array,
    ticketCounter: Number,
    usersBlacklisted: Array,
    transcriptChannel: String,
    mentionStaff: Boolean,
    staffRole: String,
    maxTickets: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('guildData', guildData, "guildData")