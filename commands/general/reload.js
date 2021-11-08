const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config/config.json')
const glob = require('glob')

module.exports = {
  name: "reload",
  aliases: ["reload-commands"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // if the user no is the owner of the guild return a message
    if (message.author.id !== message.guild.ownerId) {
        return message.channel.send(`You are not the owner of this guild.`)
    }
    client.commands.swep(() => true)
    // use the glob module to get all the files in the commands folder
    glob(`${__dirname}/../**/*.js`, async(err, filesPaths) => {
        if(err) return console.log(err)
        filesPaths.forEach((file) => {
            delete require.cache[require.resolve(file)]
            const pull = require(file);
            if(pull.name) {
                console.log(`Reloaded ${pull.name} (cmd)`)
                client.commands.set(pull.name, pull)
            }
            if(pull.aliases && Array.isArray(pull.aliases)) {
                pull.aliases.forEach(alias => {
                    client.aliases.set(alias, pull.name)
                })
            }
        })
    })
    message.channel.send(`Reloaded all commands.`)
    },
};