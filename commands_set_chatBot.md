//Started Button
curl -X POST -H "Content-Type: application/json" -d '{ 
"get_started":{
    "payload":"GET_STARTED_PAYLOAD"
}
}' "https://graph.facebook.com/v2.12/me/messenger_profile?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"

//Deleted Button
curl -X DELETE -H "Content-Type: application/json" -d '{
"fields":[
    "get_started"
]
}' "https://graph.facebook.com/v2.12/me/messenger_profile?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"

//Get started Greeting
curl -X POST -H "Content-Type: application/json" -d '{
  "greeting":[
    {
      "locale":"default",
      "text":"Hola {{user_full_name}}, El Mundial ya está aquí y todos queremos ser parte de él. Apoya a tu equipo favorito en nuestro Mundial DeBolsillo. ¡Participa!"
    }
  ] 
}' "https://graph.facebook.com/v2.12/me/messenger_profile?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"


//MENU
curl -X POST -H "Content-Type: application/json" -d '{
"persistent_menu":[
    {
    "locale":"default",
    "composer_input_disabled":false,
    "call_to_actions":[
        {
        "title":"¿En que te puedo ayudar?",
        "type":"nested",
        "call_to_actions":[
            {
            "title":"Contacto",
            "type":"postback",
            "payload":"CONTACT_INFO_PAYLOAD"
            },
            {
            "title":"F.A.Qs",
            "type":"postback",
            "payload":"FAQS_INFO_PAYLOAD"
            }
        ]
        },
        {
        "title":"Participar en la Dinámica",
        "type":"postback",
        "payload":"PRE_START_PAYLOAD"
        },
        {
        "title":"Ganadores Anteriores",
        "type":"web_url",
        "url":"https://mosshi.be",
        "webview_height_ratio":"full"
        }
    ]
    }
]
}' "https://graph.facebook.com/v2.12/me/messenger_profile?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"

//Delete MENU
curl -X DELETE -H "Content-Type: application/json" -d '{
"fields":[
    "persistent_menu"
]
}' "https://graph.facebook.com/v2.12/me/messenger_profile?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"

//Upload Image and use
curl  \
  -F 'message={"attachment":{"type":"image", "payload":{"is_reusable":true}}}' \
  -F 'filedata=@/tmp/started.gif;type=image/gif' \
  "https://graph.facebook.com/v2.12/me/message_attachments?access_token=EAADEK2GJNwwBAKcDvnBWh8KZB8GylFiaKpi0gXpBazix9GsKZBYvWjG9xrDqXwu7IMLLZBs9R4DGPTMSNyJZB5zou3fCN5ZA9aofppe6DmOgQnzqJtt6MCyIeGzb3g4Pk5V492lVpsXGQiGgDAHCaJc7jpazydDIPINkLqzVhsDHFucMgsigR"

  //{"attachment_id":"416389662155453"}