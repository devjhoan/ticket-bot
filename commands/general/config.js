const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const dataGuild = require("../../models/dataGuild");

module.exports = {
	name: "config",
	description: "Configure the bot system",
	type: 'CHAT_INPUT',
	/**
	 *
	 * @param {import("../..").Bot} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let transcript_channel, staff_role, staff_mention;
		await interaction.reply({embeds: [
			new MessageEmbed()
				.setTitle("Ticket System \🟠")
				.setDescription("Hey this is the config system!\nHere you have options for configure the bot.")
				.addField("Transcript Channel", "Set the channel where the transcript will be send.")
				.addField("Staff Role", "Set the role that can use the bot.")
				.addField("Staff Mention", "Set the role that can that the bot mentions every time it opens a ticket")
				.setColor("#2f3136")
				.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
		], components: [
			new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setLabel("Transcript Channel")
						.setStyle("PRIMARY")
						.setCustomId("config-transcript-channel"),
					new MessageButton()
						.setLabel("Staff Role")
						.setStyle("PRIMARY")
						.setCustomId("config-staff-role"),
					new MessageButton()
						.setLabel("Staff Mention")
						.setStyle("PRIMARY")
						.setCustomId("config-staff-mention"),
					new MessageButton()
						.setEmoji("👀")
						.setStyle("PRIMARY")
						.setCustomId("config-show"),
					new MessageButton()
						.setEmoji("✖️")
						.setStyle("DANGER")
						.setCustomId("config-cancel")
				)
		], fetchReply: true});

		const collector = interaction.channel.createMessageComponentCollector({
			filter: (m) => m.user.id === interaction.user.id,
			componentType: "BUTTON",
			max: 2
		});

		collector.on("collect", async (int) => {
			await int.deferUpdate();
			const button = int.customId.split("config-")[1];
			if (button === "transcript-channel") {
				interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \🟠")
						.setDescription("Hey please mention the channel where the transcript will be send.\n**Remimber** If you want to remove the data you have configured, write **remove** and send the message")
						.setColor("ORANGE")
						.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
				], components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setEmoji("✖️")
							.setStyle("DANGER")
							.setCustomId("config-cancel")
					)
				]});

				const messageCollector = interaction.channel.createMessageCollector({
					filter: (m) => m.author.id === interaction.user.id,
					max: 1
				});

				messageCollector.on("collect", async (message) => {
					message.delete();
					collector.stop();
					const mentionedChannel = message.mentions.channels.first();
					if (mentionedChannel) {
						transcript_channel = mentionedChannel.id;
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.transcriptChannel = transcript_channel;
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									transcriptChannel: transcript_channel
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the channel was setted!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error setting the channel!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else if (message.content === "remove") {
						transcript_channel = "";
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.transcriptChannel = transcript_channel;
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									transcriptChannel: transcript_channel
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the channel was removed!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error removing the channel!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else {
						return interaction.editReply({embeds: [
							new MessageEmbed()
								.setTitle("Ticket System \🔴")
								.setDescription("You need to mention a channel!")
								.setColor("RED")
								.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
						], components: []});
					}
				});
			} else if (button === "staff-role") {
				interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \🟠")
						.setDescription("Hey please mention the role that can use the bot.\n**Remimber** If you want to remove the data you have configured, write **remove** and send the message")
						.setColor("ORANGE")
						.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
				], components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setEmoji("✖️")
							.setStyle("DANGER")
							.setCustomId("config-cancel")
					)
				]});
				const messageCollector = interaction.channel.createMessageCollector({
					filter: (m) => m.author.id === interaction.user.id,
					max: 1
				});

				messageCollector.on("collect", async (message) => {
					collector.stop();
					message.delete();
					const mentionedRole = message.mentions.roles.first();
					if (mentionedRole) {
						staff_role = mentionedRole.id;
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.staffRole = staff_role;
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									staffRole: staff_role
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the staff-role was setted!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error setting the role!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else if (message.content === "remove") {
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.staffRole = "";
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									staffRole: ""
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the staff-role was removed!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error removing the role!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else {
						collector.stop();
						return interaction.editReply({embeds: [
							new MessageEmbed()
								.setTitle("Ticket System \🔴")
								.setDescription("You need to mention a role!")
								.setColor("RED")
								.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
						], components: []});
					}
				});
			} else if (button === "staff-mention") {
				interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \🟠")
						.setDescription("Hey please mention the user that can use the bot.\n**Remimber** If you want to remove the data you have configured, write **remove** and send the message")
						.setColor("ORANGE")
						.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
				], components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setEmoji("✖️")
							.setStyle("DANGER")
							.setCustomId("config-cancel")
					)
				]});
				const messageCollector = interaction.channel.createMessageCollector({
					filter: (m) => m.author.id === interaction.user.id,
					max: 1
				});

				messageCollector.on("collect", async (message) => {
					collector.stop();
					message.delete();
					const mentionedRole = message.mentions.roles.first();
					if (mentionedRole) {
						staff_mention = mentionedRole.id;
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.mentionStaff = staff_mention;
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									mentionStaff: staff_mention
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the staff-mention role was setted!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error setting the staff-mention role!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else if (message.content === "remove") {
						try {
							const guildData = await dataGuild.findOne({
								guildID: interaction.guild.id
							});
							if (guildData) {
								guildData.mentionStaff = "";
								await guildData.save();
							} else {
								const newGuildData = new dataGuild({
									guildID: interaction.guild.id,
									mentionStaff: ""
								});
								await newGuildData.save();
							}
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \✅")
									.setDescription("Hey the staff-mention was removed!")
									.setColor("GREEN")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						} catch (error) {
							interaction.editReply({embeds: [
								new MessageEmbed()
									.setTitle("Ticket System \❌")
									.setDescription("Hey there was an error removing the staff-mention role!\n" + "```" + error + "```")
									.setColor("RED")
									.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
							], components: []});
						}
					} else {
						collector.stop();
						return interaction.editReply({embeds: [
							new MessageEmbed()
								.setTitle("Ticket System \🔴")
								.setDescription("You need to mention a role!")
								.setColor("RED")
								.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
						], components: []});
					}
				});
			} else if (button === "cancel") {
				collector.stop();
				return interaction.editReply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \🔴")
						.setDescription("You have canceled the process!")
						.setColor("RED")
						.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
				], components: []});
			} else if (button === "show") {
				collector.stop();
				const guildData = await dataGuild.findOne({
					guildID: interaction.guild.id
				});
				if (!guildData) {
					return interaction.editReply({embeds: [
						new MessageEmbed()
							.setTitle("Ticket System \🔴")
							.setDescription("This server doesn't have configurated the ticket system!")
							.setColor("RED")
							.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
					], components: []});
				}
				const data = {
					transcript_channel: guildData.transcriptChannel || "Not setted",
					staff_role: guildData.staffRole || "Not setted",
					staff_mention: guildData.mentionStaff || "Not setted",
				}
				return interaction.editReply({embeds: [
					new MessageEmbed()
						.setColor("GREEN")
						.setTitle("Ticket System \✅")
						.setDescription("Here is the current configurated data:")
						.setFooter({text: "Ticket System by: Jhoan#6969", iconURL: client.user.displayAvatarURL({dynamic: true})})
						.addFields([
							{
								name: "Transcript Channel 📚",
								value: data.transcript_channel,
								inline: false
							},
							{
								name: "Staff Role 👤",
								value: data.staff_role,
								inline: false
							},
							{
								name: "Staff Mention 🗣️",
								value: data.staff_mention,
								inline: false
							}
						])
				], components: []});
			}
		});
	},
};