const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = {
    name: 'token',
    description : 'token',
    needClient : false,
    execute(){
        function getToken(){
            var Http = new XMLHttpRequest();
            var url = "https://opentdb.com/api_token.php?command=request";
            //Send Request
            Http.open('GET',url,false);
            Http.send();
            //Validate Response
            //console.log(Http);
            if(Http.readyState == 4 && Http.status == 200){
                //console.log(Http);
                //console.log(JSON.parse(Http.responseText)['token']);
                return JSON.parse(Http.responseText)['token'];           
            }else{
                return false;
            }
        
        }
       return getToken();
    }
}

