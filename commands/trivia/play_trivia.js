const Discord = require('discord.js');

module.exports = {
    name: 'play',
    description : 'play',
    needClient : true,
    execute(message, args, parameters){
        //Create a Promise Object. This will be used in tadem with 'await' to prevent JS from returning before the game has finished. Resolve() will end this promise.
        return new Promise(resolve =>{
            //Keep track of current question index.
            var questionIndex = 0;
            //Get Question Time Parameter
            var time = parameters[2] ? parseInt(parameters[2]) * 1000 : resolve(false);
            //Create User Map. This will be used to keep track of user scores.
            var userMap = new Map();
            //Function to format the winner list.
            function getWinnerList(winners){
                let winnerString = '';
                for(var winner of winners){
                    winnerString = winnerString === '' ? winner  + '\n' : winnerString + winner + '\n';
                }
                return winnerString;
             };

             function getFinalScores(scores){
                let scoreString = '';
                for (var score of scores){
                    scoreString = scoreString === '' ? score[0]  + ' - ' + score[1] + ' Points\n': scoreString + score[0]  + ' - ' + score[1] + ' Points\n';
                }
                return scoreString;
             };

            //Function to get the next question.
            function nextQuestion (questions,index) {
                return questions[index] ? questions[index] : null;
            };
            
            //Function to present the question, and collect responses.
            function playTrivia(currentQuestion){
                //Create a Promise Object. This will be used in tadem with 'await'. This promise allows the collectors to finish before asking next question. Resolve() will end this promise. 
                return new Promise(resolve => {
                    if(!currentQuestion) resolve(true);

                    //Map emojis/reactions to the correct number string.
                    var emojiMapping = {'1':'1️⃣','2':'2️⃣','3':'3️⃣', '4':'4️⃣', '5':'5️⃣', '6':'6️⃣','7':'7️⃣', '8':'8️⃣', '9':'9️⃣'};
                    
                    //Format Question
                    var questionToDisplay = (currentQuestion.question.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    
                    //Add correct aswer to incorrect asnwer array at random location.
                    var answers = currentQuestion.incorrect_answers.slice();
                    var answers_length = currentQuestion.incorrect_answers.length + 1;
                    var random_number = Math.floor(Math.random () * (answers_length - 0));
                    answers.splice(random_number,0,currentQuestion.correct_answer);
    
                    console.log(currentQuestion.correct_answer);
                    //Format Answers, removing special characters and replacing encoded ones.
                    for(var i = 0; i < answers.length; i++){
                        answers[i] = (i + 1) + ") " + (answers[i].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'")).normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    }
                    //Create Question Embed.
                    questionEmbed:{
                        var embed = new Discord.MessageEmbed();
                        embed.setColor(0x1E84D0); 
                        embed.setTitle("Question "+ (parseInt(questionIndex) + 1));
                        embed.addField(questionToDisplay, answers);
                    }
                    //Send Question, Then track (collect) reactions (answers) from the message.
                    message.channel.send(embed).then(
                        function (message) {
                            var winners = [];
                            //Have the bot setup the number of answers based on the answers.length
                            for(var i = 1; i < answers.length + 1; i++){
                                var num = String(i);
                                message.react(emojiMapping[num]);
                            }
                            //Create Filter for the Collector. This is so that it can look for any of these reactions.
                            const filter_all = (reaction, user) => {
                                return (reaction.emoji.name === '1️⃣' ||
                                reaction.emoji.name === '2️⃣' ||
                                reaction.emoji.name === '3️⃣' ||
                                reaction.emoji.name === '4️⃣' ||
                                reaction.emoji.name === '5️⃣' ||
                                reaction.emoji.name === '6️⃣' ||
                                reaction.emoji.name === '7️⃣' ||
                                reaction.emoji.name === '8️⃣' ||
                                reaction.emoji.name === '9️⃣') && user.id !== message.author.id ;
                            };
                            //Create the collector object. This Collector will track reactions on the message.
                            const collector_all = message.createReactionCollector(filter_all, { time: time });
                            //Start the collector.
                            collector_all.on('collect', (reaction, user) => {
                                userMap.get(`${user.tag}`) ? 'already exists' : userMap.set(`${user.tag}`, 0);
                                //If the user reacts with the correct answer, add their Discord ID to an array if it does not already exist.
                               if(reaction.emoji.name === emojiMapping[String(random_number + 1)]){
                                    if(!winners.includes(`${user.tag}`) && `${user.id}` !== message.author.id){
                                        console.log(`Collected correct answer from ${user.tag}`);
                                        winners.push(`${user.tag}`);
                                    }
                                }
                                //If the user reacts with the incorrect asnwer, remove it from the array if it exists.
                                if(reaction.emoji.name !== emojiMapping[String(random_number + 1)]){
                                    if(winners.includes(`${user.tag}`) && `${user.id}` !== message.author.id){
                                        console.log(`Collected incorrect answer from ${user.tag}`);
                                        var index = winners.indexOf(`${user.tag}`);
                                        winners.splice(index,1);   
                                    }
                                }
                                //Once the user reacts, check to see if they have already reacted.
                                const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(`${user.id}`));
                                try {
                                    //If so, remove the reactions
                                    if(userReactions.size > 0){
                                        for (const currentReaction of userReactions.values()) {
                                            //Remove every reaction except for the most recent one.
                                            if(currentReaction._emoji.name === reaction._emoji.name) continue;
                                                currentReaction.users.remove(`${user.id}`);
                                            }    
                                        }  
                                    } catch (error) {
                                        console.error('Failed to remove reactions.');
                                }
                            });
                            //When the collector end (after the time pas passed), get the winners array.
                            collector_all.on('end', collected => {
                                //Calculate current scores for all users.
                                for(let winner of winners){
                                    userMap.set(winner, userMap.get(winner) ? userMap.get(winner) + 100 : 100);
                                }
                                var winnerString = getWinnerList(winners);
                                //Create the winners Embed object.
                                var embed = new Discord.MessageEmbed();
                                embed.setColor(0xBADA55);
                                embed.setTitle("Results:");
                                embed.addField('Correct Answer: ', answers[random_number]);
                                //If we have the winners string, add it to the embed.
                                if(winnerString !== null && winnerString !== '') embed.addField("Winners (+100 Points):", winnerString);
                                //Send the Winners embed.
                                message.channel.send(embed).then(async function(){ 
                                    //If the current question = last question in the question array, Send the game over embed.
                                    if(questionIndex === args.length - 1){
                                        endedEmbed:{
                                            let embed = new Discord.MessageEmbed();
                                            embed.setColor(0xFD0F2B); //Make Color Random
                                            embed.setTitle("Game Ended");
                                            var scores = getFinalScores(userMap);
                                            if(scores !== null && scores !== '') embed.addField("Final Results (Points)", scores);
                                            message.channel.send(embed);
                                            }
                                        //Resolve the playTrivia() Promise.
                                        resolve(true);
                                    }else{
                                        //Increment the question index.
                                        questionIndex++;
                                        //Recursivley resolve the playTrivia() Promise, and get the next question.
                                        resolve(playTrivia(nextQuestion(args,questionIndex)));
                                    }
                                });
                                
                            });
                        }
                        
                    )
            });
        };
            //Function that waits for the playTrivia() game to complete (reolve the Promise).
            async function play(message, args){
                const result = await playTrivia(args[0]);
                console.log("Ended:" + result);
                return result; 
            };
            //Once the game is completed, reolve the original Promise..
            resolve(play(message,args));
        });
    }
}