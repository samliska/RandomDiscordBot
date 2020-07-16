const categories = require('./trivia_mapping.json');
module.exports = {
    name: 'params',
    description : 'params',
    needClient : false,
    execute(message,args){
        console.log(args[1]);
        console.log(parseInt(args[1]));

        if(args.length !== 3){
            message.reply("You must supply 3 parameters. See Example below for details.");
            return false;
        }else if (typeof args[0] !== 'string' || !categories[args[0]]){
            message.reply("The 1st parameter must be a valid category. See Example below for details.");
            return false;
        }else if (parseInt(args[1]) != args[1] || parseInt(args[1]) > 50){
            message.reply("The 2nd parameter must be a valid number of questions. See Example below for details.");
            return false;
        }else if(parseInt(args[2]) != args[2] ){
            message.reply("The 3rd parameter must be a valid number of seconds. See Example below for details.");
            return false;
        }else{
            return true;
        }
    }
}