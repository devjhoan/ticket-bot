const client = require('../index');

client.on("ready", () =>
    console.log(`${client.user.tag} is already Online!`)
);