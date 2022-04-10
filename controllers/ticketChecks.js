const { CommandInteraction, MessageEmbed } = require("discord.js");
const dataGuild = require("../models/dataGuild");
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

/**
 * 
 * @param {CommandInteraction} interaction 
 * @returns {Promise<{Boolean}>}
 */
async function havePerms(interaction) {
	const guildData = await dataGuild.findOne({
		guildID: interaction.guild.id
	});
	if (!guildData) {
		interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \❌")
				.setDescription(interaction.client.languages.__("errors.server_without_tickets"))
				.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: interaction.client.user.displayAvatarURL()})
				.setColor("RED")
		]});
		return false;
	}
	if (!guildData.staffRole && !interaction.member.permissions.has("ADMINISTRATOR")) {
		interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \❌")
				.setDescription(interaction.client.languages.__("errors.no_staff_role"))
				.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: interaction.client.user.displayAvatarURL()})
				.setColor("RED")
		]});
		return false;
	}

	if (!interaction.member.roles.cache.has(guildData.staffRole) && !interaction.member.permissions.has("ADMINISTRATOR")) {
		interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \❌")
				.setDescription(interaction.client.languages.__("errors.no_permission"))
				.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: interaction.client.user.displayAvatarURL()})
				.setColor("RED")
		]});
		return false;
	}
	return true;
}

module.exports = {
	isTicket,
	havePerms
}