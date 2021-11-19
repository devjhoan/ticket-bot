const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const mensajes = require('../../config/messages.json');
const TicketSchema = require('../../models/ticketSchema');

module.exports = {
    name: "config-roles",
    description: "Configure the panel roles",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "staff-role",
            description: "This role has access to the basic functions of the tickets",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "add",
                    description: "Add a role to the staff role",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "add-role",
                            description: "Role that has access to the basic functions of the tickets",
                            type: "ROLE",
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a role to the staff role",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "remove-role",
                            description: "Role that has access to the basic functions of the tickets",
                            type: "ROLE",
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            name: "admin-role",
            description: "This role has access to the advanced functions of the tickets",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "add",
                    description: "Add a role to the admin role",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "add-role",
                            description: "Role that has access to the advanced functions of the tickets",
                            type: "ROLE",
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a role to the admin role",
                    type: "SUB_COMMAND",
                    options: [
                        {
                            name: "remove-role",
                            description: "Role that has access to the advanced functions of the tickets",
                            type: "ROLE",
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let getSubcommandGroup = interaction.options.getSubcommandGroup("admin-role");
        let addRole = interaction.options.getRole('add-role');
        let removeRole = interaction.options.getRole('remove-role');
        const guildData = await TicketSchema.findOne({ guildID: interaction.guild.id});
        // model is 
        // guildID: String,
        // roles: {
        //     staffRole: String,
        //     adminRole: String,
        // },
        // tickets: Array,
        // channelLog: String,
        // channelTranscript: String,

        if(getSubcommandGroup === "staff-role") {
            if (guildData) {
                if (addRole) {
                    if(guildData.roles.staffRole == addRole.id) {
                        return interaction.reply({content: mensajes["ROLE-EXISTS"].replace('<role>', addRole.name), ephemeral: true});
                    } else {
                    guildData.roles.staffRole = addRole.id;
                    await guildData.save();
                    return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name), ephemeral: false});
                    }
                }
                if (removeRole) {
                    // if the database no have a role to remove then return
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
                }
            } else {
                if (addRole) {
                    await TicketSchema.create({
                        guildID: interaction.guild.id,
                        roles: {
                            staffRole: addRole.id,
                            adminRole: '',
                        },
                        tickets: [],
                        channelLog: '',
                        channelTranscript: ''
                    }).catch(err => console.log(err));
                    return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name),ephemeral: false});
                }
                if (removeRole) {
                    interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                }
            }
        }
        if(getSubcommandGroup === "admin-role") {
            if (guildData) {
                if (addRole) {
                    if(guildData.roles.adminRole == addRole.id) {
                        return interaction.reply({content: mensajes["ROLE-EXISTS"].replace('<role>', addRole.name), ephemeral: true});
                    } else {
                    guildData.roles.adminRole = addRole.id;
                    await guildData.save();
                    return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name), ephemeral: false});
                    }
                }
                if (removeRole) {
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
                }
            } else {
                if (addRole) {
                    await TicketSchema.create({
                        guildID: interaction.guild.id,
                        roles: {
                            staffRole: '',
                            adminRole: addRole.id,
                        },
                        tickets: [],
                        channelLog: '',
                        channelTranscript: ''
                    }).catch(err => console.log(err));
                    return interaction.reply({content: mensajes["ROLE-SPECIFIED"].replace('<role>', addRole.name),ephemeral: false});
                }
                if (removeRole) {
                    interaction.reply({content: mensajes["ROLE-NO-FOUND"].replace('<role>', removeRole.name), ephemeral: true});
                }
            }
        }
    }
}