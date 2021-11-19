const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');
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
        },
        {
            name: 'reason',
            description: 'reason for unblacklist',
            type: 'STRING',
            required: false
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
        if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
        if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
        if(!interaction.member.roles.cache.get(guildData.roles.staffRole) && !interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})

        let usuario = interaction.options.getUser('user');
        let razon = interaction.options.getString('reason') || 'No especificado';
        if(!usuario) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("Debes mencionar la persona a la que le deseas quitar el blacklist!\nUso: `unblacklist <mention/id>`").setColor("RED")], ephemeral: true})
        }
        if(!blacklist.tiene(usuario.id)) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("El usuario no esta blacklisteado!").setColor("RED")], ephemeral: true}) 
        }
        if(blacklist.tiene(usuario.id)) {
            blacklist.eliminar(usuario.id)
            interaction.reply(`${usuario.tag} ha sido unblacklisteado!`)
        }
        
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        let logcanal = guildData.channelLog;
        if(!logcanal) return;
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(logcanal).send({
            embeds: [new MessageEmbed()
              .setTitle("User Un-Blacklisted")
              .setColor("AQUA")
              .setTimestamp()
              .setDescription("**Staff:** <@!"+ interaction.member.user.id+"> `["+ interaction.member.user.tag +"]`\n\n ```diff\n+ "+ usuario.tag +"\n- "+razon+"```")
            ]
          })
        }
        if(config.TICKET["LOGS-SYSTEM"] == false) {
        return;
        }
    },
};