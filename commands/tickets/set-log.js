const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')

// bot config in english language

module.exports = {
  name: "set-log",
  aliases: ["set-log-channel"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // if the user is not an admin, return a message
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send("You do not have permission to use this command!");
    }
    // set the channel id / mention the channel / name of the channel
    let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    // if the channel is not found, return a message
    if (!channel) {
        return message.channel.send("Please provide a valid channel!");
    }
    // set the channel id
    let channelID = channel.id;
    // save in the config file the channel id in a array called LOG-CHANNEL
    config.LOG_CHANNEL = channelID;
    // save the config file
    require('fs').writeFile('./config/config.json', JSON.stringify(config), (err) => {
        if (err) console.log(err);
    });
    // send a message to the channel with the channel name and the channel id in a embed message with a color green 
    message.channel.send({
        embeds : [
            new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Log Channel Set")
                .setDescription(`The log channel has been set to ${channel} with the id ${channelID}`)
        ]
    }).then(msg => {
        // react to the message whit a check emoji
        msg.react("✅");
        // delete the message after 5 seconds
        setTimeout(() => {
            msg.delete();
        }, 5000);
    });
  },
};