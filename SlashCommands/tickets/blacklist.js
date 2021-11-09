const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const enable = require('../../config/booleans.json')
const config = require('../../config/config.json')
const mensajes = require('../../config/messages.json');
const db = require('megadb');
let blacklist = new db.crearDB('blacklist');

module.exports = {
    name: "blacklist",
    description: "blacklist to a user",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'user to blacklist',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'reason for blacklisting',
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
        if(enable.COMMANDS.BLACKLIST === false) return;
        if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
        let usuario = interaction.options.getUser('user');
        if(!usuario) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("Debes mencionar la persona que deseas blacklistear!\nUso: `blacklist <mention/id> <reason>`").setColor("RED")], ephemeral: true})
        }
        let razon = interaction.options.getString('reason') || "No especificado";
        if(!razon) {
          return interaction.reply({embeds: [new MessageEmbed().setDescription("Debes ingresar la razon del blacklist\nUso: `blacklist <mention/id> <reason>`").setColor("RED")], ephemeral: true})
        }
        if(blacklist.tiene(usuario.id)) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("El usuario ya esta blacklisteado!").setColor("RED")], ephemeral: true}) 
        }
        if(!blacklist.tiene(usuario.id)) {
            blacklist.establecer(usuario.id, {reason: razon})
            interaction.reply({
              embeds: [new MessageEmbed()
                .setTitle(""+config.TICKET["SERVER-NAME"]+" | Ticket System")
                .setDescription("**Staff Member:**: <@!"+ interaction.member.id+ ">\n\n ```diff\n+ "+ usuario.tag +"\n- "+razon+"```")
                .setTimestamp()
                .setColor("AQUA")
              ]
            })
            if(config.TICKET["LOGS-SYSTEM"] == true) {
              client.channels.cache.get(config.TICKET['LOG-CHANNEL']).send({
                embeds: [new MessageEmbed()
                  .setTitle("User Blacklisted")
                  .setColor("AQUA")
                  .setTimestamp()
                  .setDescription("**Staff:** <@!"+ interaction.member.user.id+"> `["+ interaction.member.user.tag +"]`\n\n ```diff\n+ "+ usuario.tag +"\n- "+razon+"```")
                ]
              })
            }
            if(config.TICKET["LOGS-SYSTEM"] == false) {
            return;
            }
        }
    },
};