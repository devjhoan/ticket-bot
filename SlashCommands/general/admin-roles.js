const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const TicketSchema = require('../../models/ticketSchema');

module.exports = {
    name: "admin-roles",
    description: "Configure the admin roles",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "set",
            description: "Set a role to the admin role",
            type: "ROLE"
        },
        {
            name: "remove",
            description: "Remove a role to the admin role",
            type: "ROLE"
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        
        if(!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        }

        let addRole = interaction.options.getRole('set');
        let removeRole = interaction.options.getRole('remove');
        const guildData = await TicketSchema.findOne({ guildID: interaction.guild.id});

        if(removeRole) {
            if(guildData) {
                if(!guildData.roles.adminRole) {
                    interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                } else {
                    if(guildData.roles.adminRole == removeRole.id) {
                        guildData.roles.adminRole = "";
                        await guildData.save();
                        return interaction.reply({content: mensajes["ROLE-REMOVED"].replace('<role>', removeRole.name), ephemeral: false});
                    } else {
                        interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                    }
                }
            } else {
                if (removeRole) {
                    interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                }
            }
        }

        if(addRole) {
            if(guildData) {
                if(guildData.roles.adminRole == addRole.id) {
                    return interaction.reply({content: mensajes["ROLE-EXISTS"].replace('<role>', addRole.name), ephemeral: true});
                } else {
                guildData.roles.adminRole = addRole.id;
                await guildData.save();
                return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name), ephemeral: false});
            }
            } else {
                await TicketSchema.create({
                    guildID: interaction.guild.id,
                    roles: {
                        staffRole: '',
                        adminRole: addRole.id,
                    },
                    tickets: [],
                    channelLog: '',
                    channelTranscript: ''
                })
                return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name),ephemeral: false});
            }
        }
    }
}