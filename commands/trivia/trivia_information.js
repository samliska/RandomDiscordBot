const { MessageEmbed } = require("discord.js");
const categories = require('./trivia_mapping.json');
module.exports = {
    name: 'info',
    description : 'info',
    needClient : false,
    execute(message){
        message.channel.send(getTriviaInfo());
        function getTriviaInfo(){
            var embed = new MessageEmbed();
            embed.setColor(0xfc030f);
            embed.setTitle("Type '!random trivia' followed by the following parameters in order");
            embed.addField('Parameters','• **category**\n• **number of questions (Max: 50)**\n• **time per question (seconds)**\n');
            embed.addField('Example', '!random trivia music 20 30');
            var categoryString = '';
            for(var category of Object.keys(categories)){
                categoryString = categoryString === '' ? "• " + category + '\n' : categoryString + "• " + category + '\n';
            }  
            embed.addField('Categories',categoryString);
            return embed;
        }
    }
}