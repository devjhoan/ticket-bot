const { CommandInteraction, MessageEmbed } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "open",
	description: "Opens a ticket",
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {import("../..").Bot} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const ticketData = await isTicket(interaction);
		if (!ticketData) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("errors.channel_without_ticket"))
					.setColor("RED")
			], ephemeral: true});
		}

		if (!ticketData.isClosed) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("errors.ticket_already_open"))
					.setColor("RED")
			], ephemeral: true});
		}

		interaction.channel.permissionOverwrites.edit(ticketData.ownerID, {
			VIEW_CHANNEL: true
		});

		ticketData.usersInTicket.forEach((id) => {
			interaction.channel.permissionOverwrites.edit(id, {
				VIEW_CHANNEL: true
			});
		});

		ticketData.isClosed = false;
		await ticketData.save();

		interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \✅")
				.setDescription(client.languages.__mf("commands.open.opened_by", {
					user_mention: `<@${interaction.user.id}>`,
					user_tag: interaction.user.tag
				}))
				.setColor("GREEN")
		]});
	},
};