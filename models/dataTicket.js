const mongoose = require('mongoose');

const dataTicket = new mongoose.Schema({
	guildID: String,
    ownerID: String,
    channelName: String,
    channelID: String,
    ticketPanel: String,
    parentID: String,
    dateCreated: Date,
    isClosed: Boolean,
    isClaimed: Boolean,
    staffClaimed: String,
    staffRoles: Array,
    usersInTicket: Array,
});

module.exports = mongoose.model('dataTicket', dataTicket, 'dataTicket');