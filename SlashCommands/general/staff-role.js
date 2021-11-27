const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const TicketSchema = require('../../models/ticketSchema');

module.exports = {
    name: "staff-roles",
    description: "Configure the staff roles",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "set",
            description: "Set a role to the staff role",
            type: "ROLE"
        },
        {
            name: "remove",
            description: "Remove a role to the staff role",
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
                if(!guildData.roles.staffRole) {
                    interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                } else {
                    if(guildData.roles.staffRole == removeRole.id) {
                        guildData.roles.staffRole = "";
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
                if(guildData.roles.staffRole == addRole.id) {
                    return interaction.reply({content: mensajes["ROLE-EXISTS"].replace('<role>', addRole.name), ephemeral: true});
                } else {
                guildData.roles.staffRole = addRole.id;
                await guildData.save();
                return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name), ephemeral: false});
            }
            } else {
                await TicketSchema.create({
                    guildID: interaction.guild.id,
                    roles: {
                        staffRole: addRole.id,
                        adminRole: '',
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