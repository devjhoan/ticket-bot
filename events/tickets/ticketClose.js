const { MessageEmbed, Discord, MessageActionRow, MessageButton } = require("discord.js");
const client = require("../../index");
const mensajes = require('../../config/messages.json');

client.on("interactionCreate", async (interaction) => {
    if(interaction.isButton()){
        if(interaction.customId === "Ticket-Open-Close") {
            interaction.deferUpdate();
        const idmiembro = interaction.channel.topic;
        const embed = new MessageEmbed()
            .setDescription("```Support team ticket controls```")
            .setColor("#2f3136")
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Transcript")
                .setStyle("SECONDARY")
                .setEmoji("📑")
                .setCustomId("Ticket-Transcript"),
            new MessageButton()
                .setLabel("Open")
                .setStyle("SECONDARY")
                .setEmoji("🔓")
                .setCustomId("Ticket-Open"),
            new MessageButton()
                .setLabel("Delete")
                .setStyle("SECONDARY")
                .setEmoji("⛔")
                .setCustomId("Ticket-Delete")
        )
        interaction.channel.permissionOverwrites.edit(idmiembro, { VIEW_CHANNEL: false });
        interaction.channel.send({
            embeds: [embed],
            components: [row]
        }) 
    }
}
});