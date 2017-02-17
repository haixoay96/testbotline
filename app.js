var https = require('https'); 
var fs = require('fs');
var express = require('express');
var sendMessageText = require('./sendMessageText.js').sendMessageText;
var sendToBot = require('./testwit.js').sendToBot;
var app = express();
var bodyParser = require('body-parser');
var options = {
    key: fs.readFileSync('callwork.biz.key'),
    cert: fs.readFileSync('callwork.biz.crt')
};
app.use(bodyParser.json());
app.post('/message', (req, res)=>{
    res.sendStatus(200);    
    console.log('nhan tin nhan webhook');
    var type = req.body.events[0].type;
    if(type === 'message'){
        console.log('Tin nhắn từ '+ req.body.events[0].source.userId);
        sendToBot(req.body.events[0].source.userId,req.body.events[0].message.text , (response)=>{
            sendMessageText(req.body.events[0].replyToken, response);
        });
    }
});
app.set('PORT', process.env.PORT || 2222);
https.createServer(options,app).listen(app.get('PORT'), ()=>{
    console.log(`Server running at port ${app.get('PORT')}`);
});
/*sendToBot('linhasdfasf', 'cho toi đặt bàn số 4 lúc 10h', (response)=>{
    console.log(response);
});*/