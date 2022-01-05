
const StatusCodes = require('http-status-codes').StatusCodes;
const utils = require('../utils');
const users = require('./users');
const FILE_PATH = './files/messages.json';

// MESSAGES's table
const g_messages = [  ];

//------------------------------------
//			API FUNCTIONS
//------------------------------------

//--------LIST MESSAGES------
//create json with all of the messagess
function list_messages( req, res) 
{
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);

	if(found_token)
	{
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(g_messages) );   //make js object to string 
	}
	else
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!");
	}
}

//--------GET CHAT--------
//get all messages between the login user to the given id user
function get_chat(req, res) 
{
	const sender_id =  parseInt( req.params.id );
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);
    const token_id = utils.get_id_from_token(req, res);
	const chat_messages = g_messages.filter((element)=> (element.from == sender_id && element.to == token_id)
														 || (element.from == token_id && element.to == sender_id));
	if (!chat_messages)
	{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Bad message sender id given" )
			return;
	}
	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!");
	}
	if (!g_messages.find(item=>item.from===sender_id || item.to===sender_id))
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such chat" )
		return;
	}
	else
	{
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(chat_messages) );   //make js object to string 
	}
}

//--------CREATE MESSAGE------
//When a user or admin create new message
function create_message( req, res )
{
    const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);
    const from = utils.get_id_from_token(req, res);
    const to = req.body.to;
	const text = req.body.text;

	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!" );
	}
	else
	{
		//check if 'text' field is not empty
		if (!text)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Missing text in request" )
			return;
		}
        //check if 'to' field is not empty
        if (!to )
        {
            res.status( StatusCodes.BAD_REQUEST );
			res.send("Missing 'to' in request")
			return;
        }
		if (!users.get_user_list().find(item=> item.id == to))
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send("User doesn't exist")
			return;
		}
		const new_message=send_message(from, to, text);
		res.status( StatusCodes.OK ); 
		res.send(JSON.stringify(new_message)); 
		save_messages();
	}
}

//--------CREATE MASSEGE FOR ALL------
//When admin create one message and send it for all
function create_message_for_all( req, res )
{
    const from_id= utils.get_id_from_token(req, res);
	const text = req.body.text;
	const user_list = users.get_user_list();
	if(from_id != 1) //if not admin
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only admin can get this request!" );
	}
	else
	{
		//check if 'text' field is not empty
		if (!text)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Missing text in request")
			return;
		}
		if (!user_list)
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send("There is no users to send")
			return;
		}
		const new_messages=[];
        user_list.forEach(
			item => { new_messages.push(send_message(from_id, item.id, text)) }
        )
		res.status( StatusCodes.OK ); 
		res.send(JSON.stringify(new_messages));  
		save_messages();
	}
}

//--------GET MESSAGE------
function get_message( req, res )
{
	const id =  parseInt( req.params.id );
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);

	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!" );
	}
	else
    {
		if ( id <= 0)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Bad message id given" )
			return;
		}
		const message =  g_messages.find( message =>  message.id == id )
		if ( !message)
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send( "No such message" )
			return;
		}
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(message) );   
	}
}


function send_message(form_user_id, to_user_id, text)
{
	const creation_time= new Date().toLocaleTimeString();
	let max_id = 0;
	g_messages.forEach(
		item => { max_id = Math.max( max_id, item.id) })
	const new_id = max_id + 1;
	const new_message = { 
			id: new_id , 
            from: form_user_id,
            to: to_user_id,
			text: text,
			creation_time: creation_time
		};
	g_messages.push(new_message);
	return new_message;
}
//------------------------------------
//			FILES FUNCTIONS
//------------------------------------

function load_messages()
{
	utils.load_file(FILE_PATH).then((data) => {
		const messages = JSON.parse(data);
		g_messages.length = 0;
		messages.forEach (elemnt => {
			g_messages.push(elemnt);
		});
	});
}

//save posts
function save_messages()
{
	utils.save_data(FILE_PATH, JSON.stringify(g_messages)).catch(err=> console.log(err));
}

module.exports = {
	list_messages: list_messages,
	get_chat: get_chat,
	create_message: create_message,
	create_message_for_all: create_message_for_all,
	get_message: get_message, 
	load_messages: load_messages,
}
