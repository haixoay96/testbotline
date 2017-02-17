const {Wit, log} = require('node-wit');
const Event = require('events').EventEmitter;
var data = require('./store.js').data;
var _ = require('lodash');
var message = new Event();
const context0 = {};
const firstEntityValue = (entities, entity) => {
    const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 && entities[entity][0].value;
    if (!val) {
        return null;
    }
    return typeof val === 'object'
        ? val.value
        : val;
};

const client = new Wit({
    accessToken: 'ORTNSIOKWSVPOQXYWTNFNGEWM5A2N6EY',
    actions: {
        send(request, response) {
            console.log('response'+ __filename);
            return new Promise(function (resolve, reject) {
                console.log(request.sessionId);
                console.log(JSON.stringify(response));
                message.emit('messageFromBot', request.sessionId, response.text);
                return resolve();
            });
        },
        getForecast({sessionId, context, text, entities}) {
            console.log(`Session ${sessionId} received ${text}`);
            console.log(`The current context is ${JSON.stringify(context)}`);
            console.log(`Wit extracted ${JSON.stringify(entities)}`);
            var location = firstEntityValue(entities, "location");
            if (location) {
                context.forecast = `${location} sunny`;
            } else {
                context.missingLocation = true;
            }
            return Promise.resolve(context);
        },
        check({sessionId, context, text, entities}) {
            var name = firstEntityValue(entities, 'name');
            if (name == 'Linh ') {
                context.have = true;
                console.log(1);
            } else {
                context.no = true;
                console.log(2);
            }
            return Promise.resolve(context);
        },
        test({sessionId, context, text, entities}) {
            var location = firstEntityValue(entities, 'location');
            context.location = location;
            return Promise.resolve(context);
        },
        datban({sessionId, context, text, entities}) {
            console.log('Xử lý datban!'+ __filename);
            console.log(entities + __filename);
            var number = firstEntityValue(entities, 'number');
            var date = firstEntityValue(entities, 'date');
            var indexSession = _.findIndex(data, {sessionId: sessionId});
            if(number && date){
                context.number = number;
                context.date = date;
                delete data[indexSession].data.number;
                delete data[indexSession].data.date;
            }
            else if(number && !date){
                context.number = number;
                data[indexSession].data.number = number;
                context.missDate = true;
                if(data[indexSession].data.date){
                    context.date = data[indexSession].data.date;
                    delete context.missDate;
                    delete data[indexSession].data.number;
                    delete data[indexSession].data.date;
                }
            }
            else if(!number && date){
                context.missNumber = true;
                data[indexSession].data.date = date;
                context.data = date;
                if(data[indexSession].number){
                    context.number = data[indexSession].number;
                    delete context.missNumber;
                    delete data[indexSession].data.number;
                    delete data[indexSession].data.date;
                }
            }else {
                context.missNumber = true;
                context.missDate = true;
            }
           
            return Promise.resolve(context);
        }
    }
});
module.exports.sendToBot = (reqSessionId, text, callback) => {
    console.log('Bot nhận và xử lý tin nhắn của:'+ reqSessionId + __filename );
    var indexSession = _.findIndex(data, {sessionId: reqSessionId});
    if (indexSession === -1) {
        data.push({sessionId: reqSessionId, data: {}});
    }
    var receiveMessage = (sessionId, response) => {
        if (reqSessionId === sessionId) {
            message.removeListener('messageFromBot', receiveMessage);
            callback(response);
        }
    }
    message.on('messageFromBot', receiveMessage);
    client
        .runActions(reqSessionId, text, context0)
        .then((context1) => {
            console.log('The session state is now: ' + JSON.stringify(context1));
        })
        .then((context2) => {
            console.log('The session state is now: ' + JSON.stringify(context2));
        })
        .catch((e) => {
            console.log('Oops! Got an error: ' + e);
            callback(e.toString());
        })

}