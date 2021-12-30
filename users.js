//const utills = require("./utills")
const express = require('express');
const StatusCodes = require('http-status-codes').StatusCodes;
const package = require('./package.json');
//const bcrypt = require('bcrypt');
const crypto = require('crypto');
const validator = require("email-validator");
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const util = require('util');
const FILE_PATH = './users.json';
const token_secret = crypto.randomBytes(64).toString('hex');
//const readFile = util.promisify(fs.readFile);
const hash = md5('sudo');
// User's table
const g_users = [];
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


load_users();

// API functions

// Version 
function get_version( req, res) 
{
	const version_obj = { version: package.version, description: package.description };
	res.status( StatusCodes.OK );
	res.send(  JSON.stringify( version_obj) );   
}

function list_users( req, res) 
{
	res.status( StatusCodes.OK );
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

	res.status( StatusCodes.OK );
	res.send(  JSON.stringify( user) );   
}

function delete_user( req, res )
{
	const id_to_delete =  parseInt( req.params.id );
	
	if ( id_to_delete <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return;
	}

	//if someone want to delete the admin
	if ( id_to_delete == 1)
	{
		res.status( StatusCodes.FORBIDDEN ); // Forbidden
		res.send( "Can't delete root user")
		return;		
	}

	//check if id exist
	const idx =  g_users.findIndex( user =>  user.id == id_to_delete )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}

	//only admin or curr user can delete
	const id = get_id_from_token(req, res);
	if(id == 1 || id== id_to_delete)
	{
		//g_users.splice( idx, 1 )
		g_users[id_to_delete].status = "deleted";
		res.status( StatusCodes.OK ); 
		res.send(  JSON.stringify( `The user with id: ${id_to_delete} was deleted!`)); 
	}
	else
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "You can't delete this user!")
		return;
	}
	save_users();
	
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
	if(!is_email_valid(email,req, res) || is_email_exist(email, g_users, req, res))
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
	res.status( StatusCodes.OK ); 
	res.send(JSON.stringify(new_user));   
	save_users();
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
	if ( !is_id_valid(id, req, res))
	{
		return;
	}

	//there is no such a user with this id
	if ( !is_id_exist )
	{
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
	res.status( StatusCodes.OK ); 
	res.send(  JSON.stringify( {user}) );  
	save_users();
}

function login(req, res)
{
	const email = req.body.email;
	let password = req.body.password;

	//checking if email valid
	if(!is_email_valid(email,req, res))
		return;

	//checking if email exist
	const user = g_users.find(element => element.email==email);
	if(user)
	{
		//check if password suitable
		const hash = md5(password);
		const user_idx =  g_users.findIndex( item =>  item.password == hash )
		if(user_idx < 0)
		{
			res.status( StatusCodes.Unauthorized );
			res.send( "The password is incorrect")
			return;
		}

		//user can loging
		//the password is suitable to email
		if(user.status == "active")
		{
			const token = jwt.sign({email}, token_secret, { expiresIn: '1d' });
			g_users[user_idx].token = token;
			res.status( StatusCodes.OK ); 
			res.send(JSON.stringify(token));
			save_users();
		}
		//user is not active
		else 
		{
			if(user.status == "suspended")
			{
				res.status( StatusCodes.UNAUTHORIZED );
				res.send( "This user is suspended!")
				return;
			}
			if(user.status == "deleted")
			{
				res.status( StatusCodes.UNAUTHORIZED );
				res.send( "This user is deleted!")
				return;
			}
		}
	}
	//email is not exist-no such user
	else
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return;
	}
}

function approve_user(req, res)
{
	const id_to_approve =  parseInt( req.params.id );
	const token = req.header('Authorization');

	//check id
	//not valid id
	if ( !is_id_valid(id_to_approve, req, res))
	{
		return;
	}
	//there is no such a user with this id
	if ( !is_id_exist(id_to_approve, g_users, req, res) )
	{
		return;
	}

	//check if admin's token
	found_token = check_token(token, req, res);
	if(found_token)
	{
		if(found_token.id == 1)
		{
			const user = g_users.find(element => element.id==id_to_approve);
			user.status = "active";
			res.status( StatusCodes.OK );
			res.send( `The user with id: ${id_to_approve} is active!`);
			save_users();
		}
		else
		{
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "Only admin can approve this request");
		}

		
	}

}
function suspend_user(req, res)
{
	const id_to_approve =  parseInt( req.params.id );
	const token = req.header('Authorization');

	//check id
	//not valid id
	if ( !is_id_valid(id_to_approve, req, res))
	{
		return;
	}
	//there is no such a user with this id
	if ( !is_id_exist(id_to_approve, g_users, req, res) )
	{
		return;
	}

	//check if admin's token
	const found_token = check_token(token, req, res);
	if(found_token)
	{
		if(found_token.id == 1)
		{
			const user = g_users.find(element => element.id==id_to_approve);
			user.status = "suspended";
			res.status( StatusCodes.OK );
			res.send( `The user with id: ${id_to_approve} is suspended!`);
			save_users();
		}
		else
		{
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "Only admin can suspend this user!");
		}
	
	}
}

function restore_user(req, res)
{
	const id_to_approve =  parseInt( req.params.id );
	const token = req.header('Authorization');

		//check id
	//not valid id
	if ( !is_id_valid(id_to_approve, req, res))
	{
		return;
	}
	//there is no such a user with this id
	if ( !is_id_exist(id_to_approve, g_users, req, res) )
	{
		return;
	}

	//check if admin's token
	const found_token = check_token(token, req, res);
	if(found_token)
	{
		if(found_token.id == 1)
		{
			const user = g_users.find(element => element.id==id_to_approve);
			user.status = "active";
			res.status( StatusCodes.OK );
			res.send( `The user with id: ${id_to_approve} is active!`);
			save_users();
		}
		else
		{
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "Only admin can restore this user!");
		}

		
	}
}
function logout(req, res)
{
	const token = req.header('Authorization');

	const user = check_token(token, req, res);
	user.token = null;

	res.status( StatusCodes.OK );
	res.send( "You logged out");
	save_users();
}

//functions
function is_email_valid(email, req, res)
{
	if(email)
	{
		if(!validator.validate(email))
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Email is not valid in request")
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
				return true;
		}
	return false;
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
function is_id_valid(id, req, res)
{
	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad id given")
		return false;
	}
	return true;
}
function is_id_exist(id, g_users, req, res)
{
	const user =  g_users.find( item =>  item.id == id )
	if ( !user )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such user")
		return false;
	}
	return true;
}
function check_token(token, req, res)
{
	//check if token exist 
	const found_token = g_users.find(element => element.token==token);
	if(!found_token)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such token")
		return false;
	}

	// //check if token identical
	// if(!(found_token.id == req.body.id))
	// {
	// 	res.status( StatusCodes.NOT_FOUND );
	// 	res.send( "No suitable token")
	// 	return false;
	// }
	return found_token;
}
function get_id_from_token(req, res)
{
	const token = req.header('Authorization');
	const found_token = check_token(token, req, res);


	return found_token.id;

}


function load_users()
{
	load_file(FILE_PATH).then((data) => {
		console.log(data);
		const users = JSON.parse(data);
		g_users.length = 0;
		users.forEach (elemnt => {
			g_users.push(elemnt);
		});
	});
}

//load file to system
async function load_file(file_path)
{
	if(! await is_file_exist(file_path))
	{
		creata_admin();
		save_data(file_path, JSON.stringify(g_users));
	}
	const data = await fs.readFile(file_path);
	return data;
}

// const data = await fs.readFile(file_path,  (err, data) => {
// 	if(err){
// 		console.log(err);
// 		return;
// 	}
// 	console.log(data)})

function creata_admin()
{
	const admin = {
		id:1, 
		full_name: 'Root', 
		email: 'root@gmail.com', 
		password: hash, 
		status: 'active'};

	g_users.push(admin);
}
// function save_users()
// {
// 	save_data('./try.txt', JSON.stringify(g_users)).catch(err=> console.log(err));
// }
function save_users()
{
	save_data(FILE_PATH, JSON.stringify(g_users)).catch(err=> console.log(err));
}

//save data to file
async function save_data(file_path, data)
{
	await fs.writeFile(file_path, data)
}


//check if file doesn't exist do not load
async function is_file_exist(file_path)
{
	try{
		const file_details = await fs.stat(file_path, (err) => {
			if(err)
				console.log(err);});
		return true;
	}
	catch(e){
		return false;
	}
}

// Routing
const router = express.Router();
router.get('/version', (req, res) => { get_version(req, res )  } );
router.get('/users', (req, res) => { list_users(req, res )  } )
router.post('/users', (req, res) => { create_user(req, res )  } )
router.put('/user/(:id)', (req, res) => { update_user(req, res )  } )
router.get('/user/(:id)', (req, res) => { get_user(req, res )  })
router.delete('/user/(:id)', (req, res) => { delete_user(req, res )  })
router.post('/user/login', (req, res) => { login(req, res )  })
router.put('/user/approve/(:id)', (req, res) => { approve_user(req, res )  })
router.put('/user/suspend/(:id)', (req, res) => { suspend_user(req, res )  })
router.put('/user/restore/(:id)', (req, res) => { restore_user(req, res )  })
router.post('/user/logout', (req, res) => { logout(req, res )  })

app.use('/api',router)


// Init 

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; });
