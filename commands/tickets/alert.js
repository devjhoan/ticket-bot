const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { error } = require("../../controllers/logger");
const { isTicket } = require("../../controllers/ticketChecks");

module.exports = {
	name: "alert",
	description: "Alert a user to respond to their ticket",
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {Client} client
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
		
		const user = interaction.guild.members.cache.get(ticketData.ownerID);
		if (!user) {
			error(`Could not find user with ID ${ticketData.ownerID}`);
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription("User not found.")
					.setColor("RED")
			], ephemeral: true});
		}

		try {
			await user.send({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \✅")
					.setDescription(client.languages.__mf("commands.alert.user_message", {
						user_mention: `<@${ticketData.ownerID}>`,
						user_tag: user.user.tag,
						channel_id: ticketData.channelID,
						channel_name: interaction.channel.name,
						link: `https://discordapp.com/channels/${interaction.guild.id}/${ticketData.channelID}`,
						direct_link: `[Direct Link](https://discordapp.com/channels/${interaction.guild.id}/${ticketData.channelID})`,
						openSince: `<t:${(Math.floor(ticketData.dateCreated / 1000))}:R>`
					}))
					.setColor("GREEN")
			]});
		} catch (error_) {
			error(error_);
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription("Could not send DM to user.")
					.setColor("RED")
			], ephemeral: true});
		}

		return interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \✅")	
				.setDescription(client.languages.__mf("commands.alert.staff_message", {
					user_mention: `<@${interaction.user.id}>`,
					channel_id: ticketData.channelID,
					direct_link: `[Direct Link](https://discordapp.com/channels/${interaction.guild.id}/${ticketData.channelID})`,
				}))
				.setColor("GREEN")
		]});
	},
};