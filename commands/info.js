const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'info',
    description : 'info',
    needClient : false,
    execute(message, args){
        message.channel.send(getInfo());
        function getInfo(message, args){
            var embed = new MessageEmbed();
            embed.setColor(0xfc030f);
            embed.setTitle("Type '!random' followed by a command");
            embed.addField('Commands','• hello\n• fact\n• trivia *Type **!random trivia info** for more information*\n');
            return embed;
        }
    }
}