const { MessageButton, MessageEmbed, MessageActionRow} = require("discord.js");
const discordTranscripts = require('discord-html-transcripts');
const client = require("../../index");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");

client.on("interactionCreate", async (interaction) => {
	let idmiembro = interaction.channel.topic;
	if (interaction.isButton()) {
		if (interaction.customId == "Ticket-Transcript") {

			const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
			if (!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`,ephemeral: true})
			var staffRole = guildData.roles.staffRole;
			if (!guildData.channelTranscript) return interaction.reply({content: `${mensajes['NO-TRANSCRIPT-CHANNEL']}`,ephemeral: true})
			
			interaction.deferUpdate();
			if (!interaction.member.roles.cache.get(staffRole)) {return;}
			const trow = new MessageActionRow().addComponents(new MessageButton().setCustomId("TR-YES").setLabel("Yes").setStyle("SUCCESS"),new MessageButton().setCustomId("TR-CN").setLabel("Cancel").setStyle("SECONDARY"),new MessageButton().setCustomId("TR-NO").setLabel("No").setStyle("DANGER"))
			interaction.channel.send({embeds: [new MessageEmbed().setDescription(mensajes["TICKET-STAFF-CONTROLS"]["USER-TRANSCRIPT"]).setColor("#2f3136")],components: [trow]})
		}
	}
	if (interaction.isButton()) {

		const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
		let transcriptcanal = guildData.channelTranscript;
		let logcanal = guildData.channelLog;
		var staffRole = guildData.roles.staffRole;

		if (interaction.customId == "TR-CN") {
			interaction.deferUpdate();
			if (!interaction.member.roles.cache.get(staffRole)) {return}
			interaction.message.delete();
		}
		if (interaction.customId == "TR-YES") {
			interaction.deferUpdate();
			if (!interaction.member.roles.cache.get(staffRole)) {return}
			interaction.message.delete();
			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("ORANGE")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor("#2f3136")
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField("Panel Name", `${Data.ticketName}`, true).addField("Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`, true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TRANSCRIPT-SAVED"]} <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})

			let user = interaction.client.users.cache.get(idmiembro);
			try {await user.send({embeds: [mensaje],files: [file]})}
			catch (error) {;(await savingMessage).edit({embeds: [new MessageEmbed().setDescription(`This user has closed direct messages`).setColor("RED")]})}

			if (!guildData.channelLog) return;
			const log = new MessageEmbed().setAuthor("" + config.TICKET["SERVER-NAME"] + " | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
		}
		if (interaction.customId == "TR-NO") {
			interaction.deferUpdate();
			if (!interaction.member.roles.cache.get(staffRole)) {return;}
			interaction.message.delete();
			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("ORANGE")
			let savingMessage = interaction.channel.send({embeds: [saving]})

			const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});

			const mensaje = new MessageEmbed().setAuthor(interaction.client.users.cache.get(idmiembro).tag, interaction.client.users.cache.get(idmiembro).avatarURL({dynamic: true})).addField("Ticket Owner", `<@!${idmiembro}>`, true).addField("Ticket Name", `${interaction.channel.name}`, true).setColor("#2f3136")
			await client.channels.cache.get(transcriptcanal).send({embeds: [mensaje],files: [file]}).then((a) => {
				const Data = guildData.tickets.find((x) => x.ticketCategory === interaction.channel.parentId);

				a.edit({embeds: [mensaje.addField("Panel Name", `${Data.ticketName}`, true).addField("Direct Transcript", `[Direct Transcript](${a.attachments.first().url})`, true).addField("Ticket Closed", `${interaction.member.user}`, true)]})
			})

			const trsend = new MessageEmbed().setDescription(`${mensajes["TICKET-STAFF-CONTROLS"]["TRANSCRIPT-SAVED"]} <#${transcriptcanal}>`).setColor("GREEN")
			;(await savingMessage).edit({embeds: [trsend]})

			if (!guildData.channelLog) return;
			const log = new MessageEmbed().setAuthor(config.TICKET["SERVER-NAME"] + " | Transcript Saved", "https://emoji.gg/assets/emoji/8704-archive.png").setColor("ORANGE").setDescription(`**User**: <@!${interaction.member.user.id}>\n**Action**: Save a ticket transcript\n**Ticket**: ${interaction.channel.name}`).setFooter("Ticket System by: Jhoan#6969")
			interaction.client.channels.cache.get(logcanal).send({embeds: [log]});
		};
	}
});