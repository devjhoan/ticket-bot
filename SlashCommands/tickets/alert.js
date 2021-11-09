const { Client, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');

module.exports = {
    name: "alert",
    description: "Notify a user that their ticket will be closed",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to notify',
            type: 'USER',
            required: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
    if(enable.COMMANDS.ALERT === false) return;
    if(!interaction.member.roles.cache.get(config.TICKET['ADMIN-ROLE'])) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
    if(interaction.channel.parentId !== config['TICKET-PANEL'].CATEGORY) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
    let si = interaction.options.getUser('user');
    let user = si;
    if(!si) {
        return interaction.reply({
            embeds: [new MessageEmbed().setDescription("\❌ Hey, no has mencionado a la persona!").setColor("RED")]
        })
    }
    const embed = new MessageEmbed()
        .setDescription("Hola "+ user.username +"\n\nTienes 5 minutos para responder el ticket!\nDe lo contrario el ticket se cerrará\n\nAtte: Administracion de "+config.TICKET["SERVER-NAME"]+".")
        .setColor("YELLOW")
    user.send({embeds: [embed]})
    interaction.reply({
        embeds: [new MessageEmbed().setDescription("\✅ He avisado a "+ user.username +" correctamente!").setColor("GREEN")]
    })
    if(config.TICKET["LOGS-SYSTEM"] == true) {
        client.channels.cache.get(config.TICKET["LOG-CHANNEL"]).send(
            {embeds: [new MessageEmbed()
                .setAuthor(""+config.TICKET["SERVER-NAME"]+" | Alert Member", "https://emoji.gg/assets/emoji/6773_Alert.png")
                .setColor("ORANGE")
                .setDescription(`
                **User**: <@!${interaction.member.user.id}>
                **Action**: Alert a member
                **Member Alert**: ${user}
                **Ticket Name**: ${interaction.channel.name}
                **Ticket Owner**: <@!${interaction.channel.topic}>`)
                .setFooter("Ticket System by: Jhoan#6969")]}
        )
      }
      if(config.TICKET["LOGS-SYSTEM"] == false) {
      return;
      }
    },
};