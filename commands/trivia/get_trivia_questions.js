const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const mapping = require("./trivia_mapping.json");
module.exports = {
    name: 'questions',
    description : 'questions',
    needClient : false,
    execute(parameters,token){
        function getTriviaQuestions(parameters,token){
            if(parameters.length !== 3){
                return false;
            }
            //Create Ajax HTTP Object
            var Http = new XMLHttpRequest();
            //Default Question Set
            var url = "https://opentdb.com/api.php?category=" + mapping[parameters[0]] + "&amount=" + parameters[1] + '&token=' + token;
            //Custom Paramter Set
            console.log(url);
            //Send Request
            Http.open('GET',url,false);
            Http.send();
            //Validate Response
            if(Http.readyState == 4 && Http.status == 200){
                //console.log(Http);
                return JSON.parse(Http.responseText) && JSON.parse(Http.responseText)['results'] ? JSON.parse(Http.responseText)['results'] : false;
                //console.log(questions);;        
            }else{
                return false;  
            }
       
        }
    return getTriviaQuestions(parameters,token);
    }
}



