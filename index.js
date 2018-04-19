'use strict';

const
	PAGE_ACCESS_TOKEN = 'EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR',
	express    = require('express'),
	bodyParser = require('body-parser'),
	request    = require('request'),
	app        = express().use(bodyParser.json());

app.listen(process.env.PORT || 443, () => console.log('webhook is listening'));

app.post('/webhook', (req, res) => { 
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			let pageID = entry.id;
			let timeOfEvent = entry.time;

			entry.messaging.forEach(function(event) {
				console.log('---AKA--');
				console.log(event.message);
				console.log('---AKA--');
				if (event.message) {
					//lo antetior?
					// Gets the message.
					
					/*let webhook_event = entry.messaging[0];
					let sender_psid = webhook_event.sender.id;

					if (webhook_event.message) {
						handleMessage(sender_psid, webhook_event.message);        
					} else if (webhook_event.postback) {
						handlePostback(sender_psid, webhook_event.postback);
					}*/
				} else {
					if(event.postback && event.postback.payload === USER_DEFINED_PAYLOAD ){
						var msg = "El Mundial ya está aquí y todos queremos ser parte de él. Apoya a tu equipo favorito en nuestro Mundial DeBolsillo. ¡Participa!";
						//sendMessage(event.sender.id,msg);
					}
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
	}else if (received_message.attachments) {
	// Get the URL of the message attachment
		let attachment_url = received_message.attachments[0].payload.url;
		response = {
		  "attachment": {
			"type": "template",
			"payload": {
			  "template_type": "generic",
			  "elements": [{
				"title": "Is this the right picture?",
				"subtitle": "Tap a button to answer.",
				"image_url": attachment_url,
				"buttons": [
				  {
					"type": "postback",
					"title": "Yes!",
					"payload": "yes",
				  },
				  {
					"type": "postback",
					"title": "No!",
					"payload": "no",
				  }
				],
			  }]
			}
		  }
		}
	}

	callSendAPI(sender_psid, response);    
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
	let response;
	let payload = received_postback.payload;

	if (payload === 'yes') {
		response = { "text": "Thanks!" }
	} else if (payload === 'no') {
		response = { "text": "Oops, try sending another image." }
	}

	callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"message": response
	}

	request({
		"uri": "https://graph.facebook.com/v2.12/me/messages",
		"qs": { "access_token": PAGE_ACCESS_TOKEN },
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (!err) {
			console.log('message sent!')
		} else {
			console.error("Unable to send message:" + err);
		}
	});
}


function setupGetStartedButton(res){
	var messageData = {
		"get_started":[{
			"payload":"USER_DEFINED_PAYLOAD"
		}]
	};

	request({
		url: 'https://graph.facebook.com/v2.12/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		form: messageData
	},

	function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send(body);
		} else { 
			res.send(body);
		}
	});
}


app.get('/webhook', (req, res) => {
	let VERIFY_TOKEN = "Holamund0_$MwWi1t00os"
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];
	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);      
		}
	}
});

//set up as bot with 'get started button'
app.get('/setup',function(req,res){
    setupGetStartedButton(res);
});