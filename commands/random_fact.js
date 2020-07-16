const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    name: 'fact',
    description : 'fact',
    needClient : false,
    execute(message, args){
        
        var getRandomFact = function (){
            //Create Ajax HTTP Object
            var Http = new XMLHttpRequest();
            var url = "https://uselessfacts.jsph.pl/random.json?language=en";
            //Send Request
            Http.open('GET',url,false);
            Http.send();
            //Validate Response
            if(Http.readyState === 4 && Http.status === 200){
                //console.log(Http);
                return JSON.parse(Http.responseText)['text'];             
            }
        };

        message.channel.send(getRandomFact());
    }
}