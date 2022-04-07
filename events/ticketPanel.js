const { MessageEmbed, TextChannel, MessageActionRow, MessageButton } = require("discord.js");
const client = require("../index");
const dataGuild = require("../models/dataGuild");
const dataTicket = require("../models/dataTicket");

client.on("interactionCreate", async (interaction) =>  {
	if (interaction.isButton()) {
		const isTicket = interaction.customId.split("-")[0] === "ticket";
		if (isTicket) {
			const buttonID = interaction.customId.split("-")[1];
			const guildData = await dataGuild.findOne({ guildID: interaction.guild.id });
			if (!guildData) {
				return interaction.followUp({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__("errors.server_without_tickets"))
						.setColor("RED")
				]});
			}
			if (!guildData.tickets || guildData.tickets.length <= 0) {
				return interaction.followUp({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__("errors.server_without_tickets"))
						.setColor("RED")
				]});
			}
			const guildTickets = guildData.tickets.map(ticket => ticket.customID);
			if (!guildTickets.includes(buttonID)) return;
			const ticketData = guildData.tickets.find((x) => {
				return x.customID === buttonID;
			});
			const ticketRoles = ticketData.panelRoles.map((role_id) => {
				return {
					id: role_id,
					allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
				}
			});

			await interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \✅")
					.setDescription(client.languages.__("embeds.message_ticket.creating"))
					.setColor("ORANGE")
			], ephemeral: true});

			const userTickets = await dataTicket.find({
				guildID: interaction.guild.id,
				ownerID: interaction.user.id
			});

			if (userTickets.length >= guildData.maxTickets) {
				return interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__("errors.reached_max_tickets"))
						.setColor("RED")
				]});
			}
			const ticketNumber = await getTicketNumber(guildData.ticketCounter, dataGuild, interaction.guild.id);
			await interaction.guild.channels.create(`ticket-${ticketNumber}`, {
				type: "text",
				parent: ticketData.panelCategory,
				permissionOverwrites: [
					{
						id: interaction.guild.id,
						deny: ["VIEW_CHANNEL"]
					},
					{
						id: interaction.user.id,
						allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]
					},
					...ticketRoles
				]
			}).then(async (channel) => {
				channel.send({embeds: [
					new MessageEmbed()
						.setTitle(client.languages.__mf("embeds.message_ticket.title", {
							ticket_number: ticketNumber,
							panel_name: ticketData.panelName
						}))
						.setDescription(client.languages.__mf("embeds.message_ticket.description", {
							ticket_number: ticketNumber,
							ticket_date: `<t:${(Math.floor(Date.now() / 1000))}:R>`,
							panel_name: ticketData.panelName,
							member_username: interaction.user.username,
							member_mention: `<@${interaction.user.id}>`,
						}))
						.setColor(client.languages.__("embeds.message_ticket.color"))
				], components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel(client.languages.__("buttons.close.text"))
							.setEmoji(client.languages.__("buttons.close.emoji"))
							.setStyle(client.languages.__("buttons.close.style"))
							.setCustomId("btn-close-ticket-opn"),
						new MessageButton()
							.setLabel(client.languages.__("buttons.claim.text"))
							.setEmoji(client.languages.__("buttons.claim.emoji"))
							.setStyle(client.languages.__("buttons.claim.style"))
							.setCustomId("btn-claim-ticket-opn")
					)
				], content: guildData.mentionStaff ? `<@!${interaction.user.id}> | <@&${guildData.mentionStaff}>` : `<@!${interaction.user.id}>`});

				const newTicket = new dataTicket({
					guildID: interaction.guild.id,
    				ownerID: interaction.user.id,
    				channelName: channel.name,
    				channelID: channel.id,
    				ticketPanel: ticketData.panelName,
    				parentID: ticketData.panelCategory,
    				dateCreated: Date.now(),
    				isClosed: false,
    				isClaimed: false,
    				staffClaimed: null,
    				staffRoles: ticketRoles.map(x => x.id),
				});
				await newTicket.save();

				interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \✅")
						.setDescription(client.languages.__mf("embeds.message_ticket.created", {
							channel_mention: `<#${channel.id}>`,
							channel_id: channel.id
						}))
						.setColor("GREEN")
				]})
			});
		}
	}
});

async function getTicketNumber(ticketCounter, guildData, guildID) {
	await guildData.findOneAndUpdate({ guildID: guildID }, { $inc: { ticketCounter: 1 } });
	const data = await dataGuild.findOne({ guildID: guildID });
	const zeroPad = (num, places) => String(num).padStart(places, '0');
	return zeroPad(data.ticketCounter, 4);
}