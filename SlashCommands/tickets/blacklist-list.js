const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
module.exports = {
    name: "blacklist-list",
    description: "Displays the list of blocked users",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if (!interaction.member.permissions.has("MANAGE_GUILD")) {
            return interaction.reply({content: mensajes['NO-PERMS'], ephemeral: true})
        }
        
        const blacklistList = await ticketSchema.findOne({
            guildID: interaction.guild.id
        })
        if(!blacklistList || !blacklistList.usersBlacklisted || blacklistList.usersBlacklisted.length == 0) {
            let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System`)
                .setDescription(`No users blacklisted`)
                .setFooter(`${interaction.guild.name}`, `${interaction.guild.iconURL({ dynamic: true })}`);
            return interaction.reply({embeds: [embed], ephemeral: true})
        }
            const data = []
            const options = blacklistList.usersBlacklisted.map(x => {
                return {
                    userID: x.userID,
                    reason: x.reason,
                    moderator : x.moderator,
                    date: x.date
                }
            })
            for(let i = 0; i < options.length; i++) {
                let user = (await interaction.client.users.fetch(options[i].userID).catch(() => "Deleted User")).tag
                data.push(`**Member:** ${user}`),
                data.push(`**Moderator:** ${await interaction.client.users.fetch(options[i].moderator).catch(() => "Deleted User!")}`),
                data.push(`**Reason:** ${options[i].reason}`),
                data.push(`**Date:** ${new Date(options[i].date).toLocaleDateString()}\n`)
            }
            let embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`${config.TICKET['SERVER-NAME']}'s blacklists!`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: false }))
                .setDescription(data.join("\n"));
            return interaction.reply({embeds: [embed]})
    },
};