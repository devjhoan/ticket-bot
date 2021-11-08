const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');

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
        if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.followUp({content: mensajes['NO-PERMS']})
        let usuario = interaction.options.getUser('user');
        let razon = interaction.options.getString('reason') || 'No especificado';
        if(!usuario) {
            return interaction.followUp({embeds: [new MessageEmbed().setDescription("Debes mencionar la persona a la que le deseas quitar el blacklist!\nUso: `unblacklist <mention/id>`").setColor("RED")]})
        }
        if(!blacklist.tiene(usuario.id)) {
            return interaction.followUp({embeds: [new MessageEmbed().setDescription("El usuario no esta blacklisteado!").setColor("RED")]}) 
        }
        if(blacklist.tiene(usuario.id)) {
            blacklist.eliminar(usuario.id)
            interaction.followUp(`${usuario.tag} ha sido unblacklisteado!`)
        }
        if(config.TICKET["LOGS-SYSTEM"] == true) {
          client.channels.cache.get(config.TICKET['LOG-CHANNEL']).send({
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