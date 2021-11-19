const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require('../../config/config.json')
const enable = require('../../config/booleans.json')
const mensajes = require('../../config/messages.json');
const ticketSchema = require("../../models/ticketSchema");
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
        
    const guildData = await ticketSchema.findOne({guildID: interaction.guild.id})
    if(!guildData) return interaction.reply({content: mensajes['NO-SERVER-FIND'], ephemeral: true})
    if(!guildData.roles || !guildData.roles.staffRole) return interaction.reply({content: mensajes["NO-ROLES-CONFIG"], ephemeral: true})
    if(!interaction.member.roles.cache.get(guildData.roles.staffRole) && !interaction.member.roles.cache.get(guildData.roles.adminRole)) return interaction.reply({content: `${mensajes['NO-PERMS']}`, ephemeral: true})
    if(!guildData.tickets || guildData.tickets.length === 0) return interaction.reply({content: mensajes['NO-TICKET-FIND'], ephemeral: true})
    const ticketData = guildData.tickets.map(z  => { return { customID: z.customID, ticketName: z.ticketName, ticketDescription: z.ticketDescription, ticketCategory: z.ticketCategory, ticketEmoji: z.ticketEmoji,}})
    const categoryID = ticketData.map(x => {return x.ticketCategory})
    if(!categoryID.includes(interaction.channel.parentId)) return interaction.reply({content: mensajes['NO-TICKET'], ephemeral: true})
    
    let user = interaction.options.getUser('user');
    const embed = new MessageEmbed()
        .setDescription("Hola "+ user.username +"\n\nTienes 5 minutos para responder el ticket!\nDe lo contrario el ticket se cerrará\n\nAtte: Administracion de "+config.TICKET["SERVER-NAME"]+".")
        .setColor("YELLOW")
        // send the embed to the user, and if it fails, send a message to the channel
    try {
        await user.send({embeds: [embed]})	
    } catch (error) {
        return interaction.reply({
            embeds: [new MessageEmbed().setDescription(`\n❌ Error: ${error}`).setColor("RED")]
        })
    }

    interaction.reply({
        embeds: [new MessageEmbed().setDescription("\✅ He avisado a "+ user.username +" correctamente!").setColor("GREEN")]
    })
        if(!guildData) return interaction.reply({content: `${mensajes['NO-SERVER-FIND']}`, ephemeral: true})
        let logcanal = guildData.channelLog;
        if(!logcanal) return;
    if(config.TICKET["LOGS-SYSTEM"] == true) {
        client.channels.cache.get(logcanal).send(
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