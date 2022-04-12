const { 
    MessageActionRow, 
    MessageButton,
    MessageEmbed,
    CommandInteraction
} = require("discord.js")
const ms = require("ms")

/**
 * 
 * @param {CommandInteraction} interaction 
 * @param {String[]} embeds 
 * @param {ms} timeout 
 * @param {Boolean} ephemeral 
 * @returns Void
 */
module.exports = async (interaction, embeds, timeout, ephemeral = false) => {

    if (embeds.length <= 0) return interaction.reply({embeds: [
        new MessageEmbed()
            .setTitle("No embeds to paginate!")
            .setColor("RED")
    ]});

    if (embeds.length === 1) return interaction.reply({embeds: [embeds[0]]});

    let current = 0;
    let emojis = ["⏪", "Previous", "Next", "⏩"];
    const row = (state) => [
        new MessageActionRow().addComponents(
            new MessageButton()
                .setEmoji(emojis[0])
                .setDisabled(state)
                .setStyle("SECONDARY")
                .setCustomId("btn1"),
            new MessageButton()
                .setLabel(emojis[1])
                .setDisabled(state)
                .setStyle("PRIMARY")
                .setCustomId("btn2"),
            new MessageButton()
                .setLabel("Delete")
                .setDisabled(state)
                .setStyle('DANGER')
                .setCustomId("btnx"),
            new MessageButton()
                .setLabel(emojis[2])
                .setDisabled(state)
                .setStyle("PRIMARY")
                .setCustomId("btn3"),
            new MessageButton()
                .setEmoji(emojis[3])
                .setDisabled(state)
                .setStyle("SECONDARY")
                .setCustomId("btn4")
        )
    ];

    const curPage = await interaction.reply({
        embeds: [embeds[current]],
        components: row(false),
        fetchReply: true,
        ephemeral,
    }).catch((x) => {throw x});

    const collector = curPage.createMessageComponentCollector({
        filter: (m) => m.user.id === interaction.member.id,
        componentType: "BUTTON",
        time: ms(timeout)
    });

    collector.on("collect", async (collected) => {
        if      (collected.customId === "btn1") current = 0
        else if (collected.customId === "btn2") current--
        else if (collected.customId === "btn3") current++
        else if (collected.customId === "btn4") current = embeds.length - 1
        else if (collected.customId === "btnx") collector.stop();

        if (current < 0) current = embeds.length - 1
        if (current >= embeds.length) current = 0

        curPage.edit({
            embeds: [embeds[current]],
            ephemeral
        }).catch(() => { });

        collected.deferUpdate();
    });

    collector.on("end", async () => {
        curPage.edit({
            embeds: [embeds[current].setColor("RED")],
            components: row(true),
            ephemeral
        }).catch((x) => { throw x });
    });
}
