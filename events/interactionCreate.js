const { error } = require("../controllers/logger");
const { havePerms } = require("../controllers/ticketChecks");
const client = require("../index");

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) {
            error(`Command ${interaction.commandName} not found`);
            return interaction.reply({ content: client.languages.__mf("errors.command_not_found",{
                command: interaction.commandName
            })});
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        if (!(await havePerms(interaction))) return;
        command.run(client, interaction, args);
    }
});