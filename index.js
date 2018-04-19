'use strict';

const
	express    = require('express'),
	bodyParser = require('body-parser'),
	app        = express().use(bodyParser.json());

app.listen(process.env.PORT || 443, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => { 
  let body = req.body;

  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {
      // Gets the message. entry.messaging is an array, but will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      //console.log(webhook_event);
      //
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }

});


// Handles messages events
function handleMessage(sender_psid, received_message) {

}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  
}


app.get('/webhook', (req, res) => {
  let VERIFY_TOKEN = "Holamund0_$MwWi1t00os"
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      //console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);      
    }
  }
});