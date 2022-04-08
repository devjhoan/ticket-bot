const { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const paginationEmbed = require("../../controllers/paginationEmbed");
const dataGuild = require("../../models/dataGuild");

module.exports = {
    name: "ticket-manage",
    description: "Manage the ticket system.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'setup',
            description: 'Setup ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'The name of the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji to use for the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'category',
                    description: 'The category to put the ticket panel in.',
                    type: 'CHANNEL',
                    channelTypes: ["GUILD_CATEGORY"],
                    required: true
                },
                {
                    name: 'custom-id',
                    description: 'The custom ID to use for the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'role-1',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: true
                },
                {
                    name: 'role-2',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: false
                },
                {
                    name: 'role-3',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: false
                }
            ],
        },
        {
            name: 'delete',
            description: 'Delete a ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'custom-id',
                    description: 'The custom ID of the ticket panel to delete.',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'List all ticket panels.',
            type: 'SUB_COMMAND'
        },
        {
            name: 'send',
            description: 'Send a ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the ticket panel to.',
                    type: 'CHANNEL',
                    channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
                    required: false
                }
            ]
        },
    ],
	/**
	 *
	 * @param {import("../..").Bot} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		const Sub_Command = interaction.options.getSubcommand(false);
		if (!Sub_Command) {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("commands.ticket_manage.no_specify"))
					.setColor("RED")
			]});
		}
		if (Sub_Command === "setup") {
			const name = interaction.options.getString("name");
			const emoji = interaction.options.getString("emoji");
			const category = interaction.options.getChannel("category");
			const custom_id = interaction.options.getString("custom-id");
			const role_1 = interaction.options.getRole("role-1");
			const role_2 = interaction.options.getRole("role-2") || null;
			const role_3 = interaction.options.getRole("role-3") || null;

			const ticket = {
				customID: custom_id,
				panelName: name,
				panelEmoji: emoji,
				panelCategory: category.id,
				panelRoles: [role_1.id, role_2 ? role_2.id : null, role_3 ? role_3.id : null]
			}
			ticket.panelRoles = ticket.panelRoles.filter(x => x !== null);

			const guildData = await dataGuild.findOne({ guildID: interaction.guild.id });
			if (guildData) {
				const alreadyExists = guildData.tickets.find(x => x.customID === custom_id);
				if (alreadyExists) {
					return interaction.reply({embeds: [
						new MessageEmbed()
							.setTitle("Ticket System \❌")
							.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.setup.already_exists", { custom_id }))
							.setColor("RED")
					]});
				}
				guildData.tickets.push(ticket);
				await guildData.save();
			} else {
				const newGuildData = new dataGuild({
					guildID: interaction.guild.id,
					tickets: [ticket],
					ticketCounter: 0,
					usersBlacklisted: [],
					transcriptChannel: null,
					mentionStaff: null,
					staffRole: null,
					maxTickets: 1
				});
				await newGuildData.save();
			}

			const ticketMapped = "```yaml\n" + `CustomID: ${ticket.customID}\nName: ${ticket.panelName}\nEmoji: ${ticket.panelEmoji}\nCategory: ${ticket.panelCategory}\nRoles:\n${ticket.panelRoles.map((id, i) => {
				const role = interaction.guild.roles.cache.get(id);
				return ` ${i+1}: ${role.name}`;
			}).join("\n")}\n` + "```";
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \✅")
					.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.setup.created", { panel_info: ticketMapped }))
					.setColor("GREEN")
			]});
		} else if (Sub_Command === "delete") {
			const custom_id = interaction.options.getString("custom-id");

			const guildData = await dataGuild.findOne({ guildID: interaction.guild.id });
			if (!guildData) {
				return interaction.reply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.delete.not_exists", { custom_id }))
						.setColor("RED")
				]});
			}
			const ticketIndex = guildData.tickets.findIndex(x => x.customID === custom_id);
			if (ticketIndex === -1) {
				return interaction.reply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.delete.not_exists", { custom_id }))
						.setColor("RED")
				]});
			}
			guildData.tickets.splice(ticketIndex, 1);
			await guildData.save();

			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \✅")
					.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.delete.deleted", { custom_id }))
					.setColor("GREEN")
			]});
		} else if (Sub_Command === "list") {
			const guildData = await dataGuild.findOne({ guildID: interaction.guild.id });
			if (!guildData) {
				return interaction.reply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.list.no_panels"))
						.setColor("RED")
				]});
			}
			const embeds = [];
			for (const panel of guildData.tickets) {
				embeds.push(
					new MessageEmbed()
						.setTitle("Ticket System \✅")
						.setDescription(client.languages.__("commands.ticket_manage.sub_commands.list.description"))
						.setImage("https://i.stack.imgur.com/Fzh0w.png")
						.addField("CustomID", panel.customID, true)
						.addField("Name", panel.panelName, true)
						.addField("Emoji", panel.panelEmoji, true)
						.addField("Category", `<#${panel.panelCategory}>`, true)
						.addField("Roles", panel.panelRoles.map((id) => {
							const role = interaction.guild.roles.cache.get(id);
							return role ? `<@&${role.id}>` : id;
						}).join("\n"), true)
						.setColor("AQUA")
						.setFooter({text: client.languages.__mf("commands.ticket_manage.sub_commands.list.footer", {
							page: embeds.length + 1,
							pages: guildData.tickets.length
						}), iconURL: interaction.client.user.displayAvatarURL()})
				);
			}
			paginationEmbed(interaction, embeds, "60s", false);
		} else if (Sub_Command === "send") {
			const channel = interaction.options.getChannel("channel") || interaction.channel;
			const guildData = await dataGuild.findOne({ guildID: interaction.guild.id });
			
			if (!guildData) {
				return interaction.reply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.send.no_panels"))
						.setColor("RED")
				]});
			} else if (guildData?.tickets.length === 0) {
				return interaction.reply({embeds: [
					new MessageEmbed()
						.setTitle("Ticket System \❌")
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.send.no_panels"))
						.setColor("RED")
				]});
			} else {
				await interaction.deferReply({
					ephemeral: true
				});
				const tickets = guildData.tickets;
				const components = [];
				lastComponents = new MessageActionRow;
				const options = tickets.map((ticket) => {
					return  {
						customID: ticket.customID,
						emoji: ticket.panelEmoji,
						name: ticket.panelName
					}
				});
				for (const panel of options) {
					if (panel.emoji !== undefined) {
						lastComponents.addComponents(
							new MessageButton()
								.setCustomId(`ticket-${panel.customID}`)
								.setEmoji(panel.emoji)
								.setStyle("SECONDARY")
						)
						if (lastComponents.components.length === 5) {
							components.push(lastComponents);
							lastComponents = new MessageActionRow();
						}
					}
				}
				if (lastComponents.components.length > 0) {
					components.push(lastComponents);
				}
				const panels = options.map((x, i) => {
					return client.languages.__mf("commands.ticket_manage.sub_commands.send.embed_config.separator", {
						emoji: x.emoji,
						name: x.name,
						counter: i + 1
					});
				});
				channel.send({embeds: [
					new MessageEmbed()
						.setTitle(client.languages.__("commands.ticket_manage.sub_commands.send.embed_config.title"))
						.setDescription(client.languages.__mf("commands.ticket_manage.sub_commands.send.embed_config.description", {separator: panels.join("\n")}))
						.setColor(client.languages.__("commands.ticket_manage.sub_commands.send.embed_config.color"))
						.setFooter({text: client.languages.__("commands.ticket_manage.sub_commands.send.embed_config.footer")})
				], components}).then(() => {
					interaction.followUp({embeds: [
						new MessageEmbed()
							.setTitle("Ticket System \✅")
							.setDescription(client.languages.__("commands.ticket_manage.sub_commands.send.send_success"))
							.setColor("GREEN")
					]});
				})
			}
		} else {
			return interaction.reply({embeds: [
				new MessageEmbed()
					.setTitle("Ticket System \❌")
					.setDescription(client.languages.__("commands.ticket_manage.no_specify"))
					.setColor("RED")
			]});
		}
	},
};