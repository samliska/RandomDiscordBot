module.exports = {
    name: 'hello',
    description : 'hello world',
    needClient : false,
    execute(message, args){
        message.reply('Hello');
    }
}