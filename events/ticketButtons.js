const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const dataTicket = require("../models/dataTicket");
const client = require("..");

client.on("interactionCreate", async (interaction) => {
	if (interaction.isButton()) {
		const buttonID = interaction.customId.split("btn-")[1];
		if (buttonID === "close-ticket-opn") {
			await interaction.deferUpdate();
			const userData = await dataTicket.findOne({
				guildID: interaction.guild.id,
				channelID: interaction.channel.id
			});
			if (!userData) {
				return interaction.followUp({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__("errors.channel_without_ticket"))
						.setColor("RED")
				], ephemeral: true});
			}
			if (userData.isClosed) {
				return interaction.followUp({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__("errors.ticket_already_closed"))
						.setColor("RED")
				], ephemeral: true});
			}
			interaction.channel.permissionOverwrites.edit(userData.ownerID, {
				VIEW_CHANNEL: false,
			});
			userData.usersInTicket.forEach((user) => {
				interaction.channel.permissionOverwrites.edit(user, {
					VIEW_CHANNEL: false,
				});
			});
			userData.isClosed = true;
			await userData.save();

			return interaction.channel.send({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \✅")
					.setDescription(client.languages.__mf("buttons.close.messages.closed_ticket", {
						user_mention: `<@${interaction.user.id}>`,
						user_id: interaction.user.id,
						channel_mention: `<#${interaction.channel.id}>`,
						channel_id: interaction.channel.id
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
		}
	}
});