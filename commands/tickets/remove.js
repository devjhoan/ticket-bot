const { CommandInteraction, MessageEmbed } = require("discord.js");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "remove",
	description: "Remove a user from a ticket channel.",
	type: 'CHAT_INPUT',
	options: [
		{
			name: "user",
			description: "The user to remove from the ticket.",
			type: "USER",
			required: true
		}	
	],
	/**
	 *
	 * @param {import("../..").Bot} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const user = interaction.options.getUser('user');
		const ticketData = await isTicket(interaction);
		if (!ticketData) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("errors.channel_without_ticket"))
					.setColor("RED")
			], ephemeral: true});
		}
		if (!ticketData.usersInTicket.includes(user.id)) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__mf("commands.remove.user_not_in_ticket", {
						user_mention: `<@${user.id}>`,
						user_tag: user.tag
					}))
					.setColor("RED")
			], ephemeral: true});
		}

		try {
			await interaction.channel.permissionOverwrites.delete(user.id);
		} catch {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription("An error occured while removing the user from the ticket." + "```" + error + "```")
					.setColor("RED")
			], ephemeral: true});
		}

		ticketData.usersInTicket.splice(ticketData.usersInTicket.indexOf(user.id), 1);
		await ticketData.save();

		return interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \✅")
				.setDescription(client.languages.__mf("commands.remove.user_removed", {
					user_mention: `<@${user.id}>`,
					user_tag: user.tag
				}))
				.setColor("GREEN")
		]});
	},
};