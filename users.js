//const utills = require("./utills")
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
//const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require("email-validator");
const md5 = require('md5');

let port =3000
const app = express()



// General app settings
const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}

app.use( set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));



// User's table
const g_users = [ {id:1, full_name: 'Root'} ];
// API functions

// Version 
function get_version( req, res) 
{
	const version_obj = { version: package.version, description: package.description };
	res.send(  JSON.stringify( version_obj) );   
}

function list_users( req, res) 
{
	res.send(  JSON.stringify( g_users) );   //make js object to string
}

function get_user( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	const user =  g_users.find( user =>  user.id == id )
	if ( !user)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	res.send(  JSON.stringify( user) );   
}

function delete_user( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	if ( id == 1)
	{
		res.status( StatusCodes.FORBIDDEN ); // Forbidden
		res.send( "Can't delete root user")
		return;		
	}

	const idx =  g_users.findIndex( user =>  user.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	g_users.splice( idx, 1 )
	res.send(  JSON.stringify( {}) );   
}

//--------CREATE USER------
//When a new user sign in we create user
//with status 'created'
function create_user( req, res )
{
	const full_name = req.body.name;
	const email =req.body.email;
	let password = req.body.password;
	const creation_date = new Date().toLocaleDateString();

	//check if full name field is not empty
	if ( !full_name)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing name in request")
		return;
	}

	//check if email field is not empty or if valid email or if already in use
	if(!is_email_valid(email,req, res) || !is_email_exist(email, g_users, req, res))
		return;
	
	if(!check_password(password, req, res))
		return;

	// Find max id  & create unique ID
	let max_id = 0;
	g_users.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)
	const new_id = max_id + 1;
	
	//hash password
	// const hash = crypto.createHash('sha256').update(password);
	const hash = md5(password);
	const new_user = { 
		id: new_id , 
		full_name: full_name,
		email: email,
		password: hash,
		creation_date: creation_date,
		status: "created"
	};
	g_users.push(new_user);
	res.send(JSON.stringify(new_user));   
}

//--------UPDATE USER------
//user can update his details such as email, password and full name 
//admin can uptade status to active or suspended
function update_user( req, res )
{
	const id =  parseInt( req.params.id );
	const name = req.body.full_name;
	const status = req.body.status;
	const email = req.body.email;
	let password = req.body.password;
 
	//not valid id
	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	//there is no such a user with this id
	const user =  g_users.find( item =>  item.id == id )
	if ( !user )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	//name field is empty
	if (!name)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing name in request")
		return;
	}

	//checking email validation
	if(!is_email_valid(email, req, res))
		return;
		
	const index = g_users.findIndex(element => element.email==email);

	//there is somone with that email
	if(index >= 0)
	{
		if(!(g_users[index].id == id))                            //check if its the cuurent user or not
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "This E-mail is already in use")
			return;
		}                                
		
	}

	// if(!check_password(password, req, res))
	// 	return;

	//const hash = md5(password);
	user.full_name = name;
	user.email = email;
	//user.password = hash;

	// //if the loged-in user is the admin
	// if (req.tokenData.email === process.env.ADMIN) 
	// {
	// 	const user = g_users[idx];
	// 	user.status = status;
	// } 
	// else {
	// 	if (g_users[idx].status != status)
	// 	{
	// 		res.status( StatusCodes.UNAUTHORIZED);
	// 		res.send( "UNAUTHORIZED user request")
	// 		return;
	// 	}
	// 	bcrypt.hash(req.body.password, 10, (err, hash) => {
	// 		if (err) {
	// 			res.status( StatusCodes.INTERNAL_SERVER_ERROR );
	// 			res.send(err);
	// 			return;
	// 		} 
	// 		else {
	// 			const user = g_users[idx];
	// 			user.full_name = name;
	// 			user.email = email;
	// 			user.password=hash
	// 		}
	// 	})
	// } 
	res.send(  JSON.stringify( {user}) );  
}

function is_email_valid(email, req, res)
{
	if(email)
	{
		if(!validator.validate(email))
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "The email is not valid in request")
			return false;
		}
	}
	else
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing email in request")
		return false;
	}
	return true;
}
function is_email_exist(email, g_users, req, res)
{
	const email_found = g_users.find(element => element.email==email);
	if(email_found)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "This E-mail is already in use")
				return false;
		}
	return true;
}

function check_password(password,req, res)
{
	if(!password || !password.trim())
	{
		res.status( StatusCodes.INTERNAL_SERVER_ERROR );
		res.send("Missing password in request");
		return false;
	}
	return true;
}
// Routing
const router = express.Router();
router.get('/version', (req, res) => { get_version(req, res )  } );
router.get('/users', (req, res) => { list_users(req, res )  } )
router.post('/users', (req, res) => { create_user(req, res )  } )
router.put('/user/(:id)', (req, res) => { update_user(req, res )  } )
router.get('/user/(:id)', (req, res) => { get_user(req, res )  })
router.delete('/user/(:id)', (req, res) => { delete_user(req, res )  })

app.use('/api',router)


// Init 

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; });
