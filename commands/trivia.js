const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/trivia').filter(file => file.endsWith('.js'));
//console.log(commandFiles);
const trivia = new Object();
trivia.commands = new Map();

for(const file of commandFiles){
    //console.log(file);
    const command = require(`./trivia/${file}`);
    trivia.commands.set(command.name,command);
}

module.exports = {
    name: 'trivia',
    description : 'trivia',
    needClient : true,
    execute(message, args, client){
        //Return Info if trivia info was requested.
        if(args.includes('info')){
            return trivia.commands.get('info').execute(message);
        }
        //Parse args into valid parameters.
        var validate_parameters = args ? trivia.commands.get('params').execute(message,args) : false;

        if(!validate_parameters){
            return trivia.commands.get('info').execute(message);
        }
        //Get Token if Client does not already have one.
        client.triviaToken = client.triviaToken ? client.triviaToken : trivia.commands.get('token').execute();
        //Get Questions if Client does not already have them.
        
        if (client.triviaQuestions){
            message.reply("Trivia Game Already In Progress");
            return;
        }else{
            client.triviaQuestions = trivia.commands.get('questions').execute(args,client.triviaToken);
        }
        //console.log(client.triviaQuestions);
        async function attemptGame(){
            var triviaEnded = await trivia.commands.get('play').execute(message,client.triviaQuestions,args);

            if(triviaEnded === true){
                client.triviaQuestions = null;
            }
    
        }
        client.triviaQuestions ? attemptGame() : true;
    }
}

