//Require Discord JS library
const Discord = require('discord.js');
const fs = require('fs');
//Require Config
const {token,prefix} = require('./config.json');
//Create BOT object
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name,command);

};
//console.log(client.commands);
//Verify that bot is online
client.on('ready', ()=>{
    console.log("Online");
});
//Login
client.login(token);

//Bot Message Listener
client.on('message', message => {
    //console.log("Old: ");
    //console.log(message.client.triviaToken)
    if (!message.content.startsWith(prefix) || message.author.bot || message.content.substring(prefix.length, prefix.length + 1) !== ' ') return;

    var userCommand = message.content.slice(prefix.length + 1);

    const args = userCommand.split(' '); 
    userCommand = args.shift();
    //console.log(userCommand);
    //console.log(args);
    if(!client.commands.has(userCommand)) return;

    try{
        client.commands.get(userCommand).needClient ? client.commands.get(userCommand).execute(message, args, message.client) : client.commands.get(userCommand).execute(message, args);
    }catch(error){
        console.error(error);
    }
    //console.log("New: ");
    //console.log(message.client.triviaToken);
});
