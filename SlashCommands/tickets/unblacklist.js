const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
module.exports = {
    name: "unblacklist",
    description: "unblacklist to a member",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to unblacklist',
            type: 'USER',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        if(enable.COMMANDS.UNBLACKLIST === false) return;
    
        const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
        if(!interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: mensajes['NO-PERMS'], ephemeral: true})
        if(!guildData) {
          return interaction.reply({content: `${mensajes["NO-SERVER-FIND"]}`, ephemeral: true})
        }
        let usuario = interaction.options.getUser('user')
        if(!usuario) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("You must mention the person you want unblacklist!\nUsague: `unblacklist <mention/id>`").setColor("RED")], ephemeral: true})
        }
    
        const blacklistData = guildData.usersBlacklisted;
        const findBlacklisted = blacklistData.find(user => user.userID === usuario.id);
        if(!findBlacklisted) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("This user is not blacklisted").setColor("RED")], ephemeral: true})
        }
        let filteredBlacklisted = blacklistData.filter(user => user.userID !== usuario.id);
        guildData.usersBlacklisted = filteredBlacklisted;
        await guildData.save();
        
        let embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Ticket System | User Unblacklisted`)
                .setDescription(`The user has been successfully unblacklisted*`);
        return interaction.reply({embeds: [embed]})
    },
};