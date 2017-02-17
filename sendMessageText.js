var request = require('request');
var sendMessageText = (replyToken , text )=>{
  request({
          uri: 'https://api.line.me/v2/bot/message/reply',
          method:'POST',
          json: {
              "replyToken": replyToken,
              messages:[
                  {
                      type: 'text',
                      text: text
                  }
              ]
          },
          headers:{
            'Content-Type':'application/json',
            Authorization: 'Bearer jZAw0ZAuE1Wm02TOD6lNkeOH1AB+4iGwY89Qx/I5XVjIdg1zIIXIWP4U39VELjdLA5JQG+05yvXll5e5vtVoIAFe1CgI3v6G4Z/PWulOOV8+y7+76LyCvPqqc+Yzjeja+oP0Rc3XZrdfvcNlgL6V7QdB04t89/1O/w1cDnyilFU='
          },

      }, (error, response , body)=>{
            if(error){
                console.log('Send message failure!');
                console.error(error);
                return;
            }
            console.log('Send message successfull!');
      });
}
module.exports.sendMessageText = sendMessageText;