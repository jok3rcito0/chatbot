'use strict';

const
	express    = require('express'),
	bodyParser = require('body-parser'),
	app        = express().use(bodyParser.json());

app.listen(process.env.PORT || 443, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => { 
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			// Gets the message.
			let webhook_event = entry.messaging[0];
			//console.log(webhook_event);

			let sender_psid = webhook_event.sender.id;
			//console.log('Sender PSID: ' + sender_psid);ç

			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);        
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
		});

		res.status(200).send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}

});


// Handles messages events
function handleMessage(sender_psid, received_message) {
	let response;

	if (received_message.text) {    
		response = {
			"text": `You sent the message: "${received_message.text}". Now send me an image!`
		}
	}

	callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}
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