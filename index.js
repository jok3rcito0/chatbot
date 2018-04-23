'use strict';

var mysql = require('mysql');
var con   = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'olamund0.',
	database : 'debolsillo'
});

con.connect(function(err) {
	if (err) throw err;
	console.log("It's connected");
});
/*

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});


con.query('SELECT * FROM ', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

con.end();
*/

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
			
			let webhook_event = entry.messaging[0];
			let sender_psid = webhook_event.sender.id;
			let message = webhook_event.message;
			
			console.log('---ENTRYYYY---');
			console.log(webhook_event);
			console.log('---ENTRYYYY---');

			if(message && message.quick_reply){
				executeAction(sender_psid, message.quick_reply.payload)
			}else if(message && message.text){
				console.log('es un texto que el usuario envia');
			}else{
				if(webhook_event.postback && webhook_event.postback.payload === 'GET_STARTED_PAYLOAD' ){
					handleSenderAction(sender_psid);
					let msg = { "text": "Antes de empezar, checa las instrucciones:" }
					callSendAPI(sender_psid, msg);
					setTimeout(function() {
						startedPack(sender_psid)
					}, 3000);
				}

			}

			/*entry.messaging.forEach(function(event) {
				console.log(event);
				console.log(webhook_event);
			});*/
		});

		res.status(200).send('EVENT_RECEIVED');
	} else {
		res.sendStatus(404);
	}
});

function executeAction(sender_psid, payload){
	switch (payload) {
		case 'PRE_START_PAYLOAD':
			handleSenderAction(sender_psid);
			let msg = {'text':'Antes de comenzar ingresa tu nombre sin apellidos'}
			callSendAPI(sender_psid, msg);
			break;
	
		default:
			break;
	}
}

function handleSenderAction(sender_psid, action='typing_on'){
	let request_body = {
		"recipient": {
			"id": sender_psid
		},
		"sender_action" : action
	}

	request({
		"uri": "https://graph.facebook.com/v2.12/me/messages",
		"qs": { "access_token": PAGE_ACCESS_TOKEN },
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (err) {
			console.error("sender action error:" + err);
		}
	});
	
}

//Handle send files
function handleAttachment(sender_psid, received_message) {
	let response;

	response = {
		"attachment": {
			"type":"image",
			"payload": {
				"attachment_id": received_message
			}
		}
	}

	callSendAPI(sender_psid, response);
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
	let response;

	if (received_message.text) {    
		response = {"text": `You sent the message: "${received_message.text}". Now send me an image!`
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
		"message": response,
		"messaging_type": "RESPONSE",
		"notification_type" : "REGULAR"
	}

	request({
		"uri": "https://graph.facebook.com/v2.12/me/messages",
		"qs": { "access_token": PAGE_ACCESS_TOKEN },
		"method": "POST",
		"json": request_body
	}, (err, res, body) => {
		if (err) {
			console.error("Unable to send message:" + err);
		}
	});
}

function startedPack(sender_psid){
	handleAttachment(sender_psid, '416389662155453');
	handleSenderAction(sender_psid);
	let replies = {
		"text": "Listo?",
		"quick_replies":[
			{
				"content_type":"text",
				"title":"Participar",
				"payload":"PRE_START_PAYLOAD"
			}
		]
	}
	setTimeout(function() {
		callSendAPI(sender_psid, replies)
	}, 3000);
	
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