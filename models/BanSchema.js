const mongoose = require('mongoose')

const banSchema = new mongoose.Schema ({
    guildID: String,
    memberID: String,
    bans: Array,
    moderator: Array,
    date: Array
})

module.exports = mongoose.model('banSchema', banSchema)