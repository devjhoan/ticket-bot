const { CommandInteraction } = require("discord.js");
const dataTicket = require("../models/dataTicket");

/**
 * 
 * @param {CommandInteraction} interaction
 * @returns {Promise<{
 * 	guildID: String,
 * 	ownerID: String,
 * 	channelName: String,
 * 	channelID: String,	
 * 	ticketPanel: String,
 * 	parentID: String,
 * 	dateCreated: Date,
 * 	isClosed: Boolean,
 * 	isClaimed: Boolean,
 * 	staffClaimed: String,
 * 	staffRoles: Array,
 * 	usersInTicket: Array,
 * 	save: Function,
 * 	remove: Function,
 *  delete: Function
 * }> | boolean}
 */
async function isTicket(interaction) {
	const userData = await dataTicket.findOne({
		channelID: interaction.channel.id
	});	
	if (!userData) {
		return false;
	} else {
		return userData;
	}
}

module.exports = {
	isTicket
}