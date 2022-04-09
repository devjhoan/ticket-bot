const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "close",
	description: "Close a ticket.",
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

		if (ticketData.isClosed) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("errors.ticket_already_closed"))
					.setColor("RED")
			], ephemeral: true});
		}

		interaction.channel.permissionOverwrites.edit(ticketData.ownerID, {
			VIEW_CHANNEL: false
		});

		ticketData.usersInTicket.forEach(async (id) => {
			interaction.channel.permissionOverwrites.edit(id, {
				VIEW_CHANNEL: false
			});
		});

		ticketData.isClosed = true;
		await ticketData.save();

		interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \✅")
				.setDescription(client.languages.__mf("commands.close.closed_by", {
					user_mention: `<@${interaction.user.id}>`,
					user_tag: interaction.user.tag
				}))
				.setColor("GREEN"),
			new MessageEmbed()
				.setDescription(client.languages.__("buttons.close.messages.closed_ticket_staff"))
				.setColor("#2f3136")
		], components: [
			new MessageActionRow().addComponents(
				// transcript, open, delete
				new MessageButton()
					.setCustomId("btn-transcript-ticket")
					.setLabel(client.languages.__("buttons.transcript.text"))
					.setEmoji(client.languages.__("buttons.transcript.emoji"))
					.setStyle(client.languages.__("buttons.transcript.style")),
				new MessageButton()
					.setCustomId("btn-open-ticket")
					.setLabel(client.languages.__("buttons.open.text"))
					.setEmoji(client.languages.__("buttons.open.emoji"))
					.setStyle(client.languages.__("buttons.open.style")),
				new MessageButton()
					.setCustomId("btn-delete-ticket")
					.setLabel(client.languages.__("buttons.delete.text"))
					.setEmoji(client.languages.__("buttons.delete.emoji"))
					.setStyle(client.languages.__("buttons.delete.style"))
			)
		]});
	},
};