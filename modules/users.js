
const StatusCodes = require('http-status-codes').StatusCodes;
const md5 = require('md5');
const hash = md5('sudo');
const crypto = require('crypto');
const token_secret = crypto.randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const validator = require("email-validator");
const FILE_PATH ="./files/users.json";


g_users = [];

// --------API FUNCTION--------
// Version 
function get_version( req, res) 
{
	const token = req.header('Authorization');
	found_token = utils.check_token(token, req, res);

	if(found_token)
	{
		const version_obj = { version: package.version, description: package.description };
		res.status( StatusCodes.OK );
		res.send(  JSON.stringify( version_obj) );  
	}
	else
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only logon user can get this request!");
	}
	 
}

function create_admin()
{
	const admin = {
		id:1, 
		full_name: 'Root', 
		email: 'root@gmail.com', 
		password: hash, 
		status: 'active'
    };
	g_users.push(admin);
}


//LIST USER
function list_users( req, res) 
{
	const token = req.header('Authorization');
	found_token = utils.check_token(token, req, res);

	if(found_token)
	{
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(g_users) );   //make js object to string 
	}
	else
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!" );
	}
}

//GET USER
function get_user( req, res )
{
	const id =  parseInt( req.params.id );
	const token = req.header('Authorization');
	found_token = utils.check_token(token, req, res);

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
			res.send( "Bad id given" );
			return;
		}

		const user =  g_users.find( user =>  user.id == id );
		if ( !user)
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send( "No such user")
			return;
		}

		res.status( StatusCodes.OK );
		res.send( JSON.stringify( user) );  
	}
	 
}

//DELETE USER
function delete_user( req, res )
{
	const id_to_delete =  parseInt( req.params.id );

	const token = req.header('Authorization');
	found_token = utils.check_token(token, req, res);
	
	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!");
	}

	else
	{
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
			g_users[idx].status = "deleted";
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
	
	
}

//CREATE USER
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
		res.send("Missing name in request")
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

//UPDATE USER
//user can update his details such as email, password and full name 
//admin can uptade status to active or suspended
function update_user( req, res )
{
	const id =  parseInt( req.params.id );
	const name = req.body.name;
	//const status = req.body.status;
	const email = req.body.email;
	let password = req.body.password;

	const token = req.header('Authorization');
	found_token = utils.check_token(token, req, res);
 
	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only logon user can get this request!");
	}
	else
	{	
		//check if its the user himeself
		if(found_token.id != id)
		{
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "Only the user himself can update his own data");
			return;
		}		
		else
		{
			//not valid id
			if ( !is_id_valid(id, req, res))
				return;
			//there is no such a user with this id
			if ( !is_id_exist )
				return;

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
			found_token.full_name = name;
			found_token.email = email;
			res.status( StatusCodes.OK ); 
			res.send(  JSON.stringify( {found_token}) );  
			save_users();
		}
		
	}
	
}

//LOGIN
//login function get email and password
//returns token if succeed
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
		const user_idx =  g_users.findIndex( element => element.email==email )
		if(user.password != hash)
		{
			res.status( StatusCodes.UNAUTHORIZED );
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
				res.send( "Can't log in because you are suspended!")
				return;
			}
			if(user.status == "deleted")
			{
				res.status( StatusCodes.UNAUTHORIZED );
				res.send( "Can't log in because this user is deleted!")
				return;
			}
			else
			{
				res.status( StatusCodes.UNAUTHORIZED );
				res.send( "Can't log because you were not approved by admin!")
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

//APPROVE USER
//Only admin can approve user 
//admin change status to active
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
	found_token = utils.check_token(token, req, res);
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

//SUSPEND USER
//Only admin can suspend user 
//admin change status to suspend
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
	const found_token = utils.heck_token(token, req, res);
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

//RESTORE USER
//Only admin can restore user
//admin change status back to active
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
	const found_token = utils.check_token(token, req, res);
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

//LOGOUT
//user can logout
function logout(req, res)
{
	const token = req.header('Authorization');

	const user = utils.check_token(token, req, res);
	user.token = null;

	res.status( StatusCodes.OK );
	res.send( "You logged out");
	save_users();
}

//---------validation functions--------
function is_email_valid(email, req, res)
{
	if(email)
	{
		if(!validator.validate(email))
		{
			res.status( StatusCodes.UNAUTHORIZED );
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
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "This E-mail is already in use")
				return true;
		}
	return false;
}
function check_password(password,req, res)
{
	if(!password || !password.trim())
	{
		res.status( StatusCodes.BAD_REQUEST );
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
function get_user_list()
{
    return g_users;
}


//------------files functions---------
function load_users()
{
	utils.load_file(FILE_PATH).then((data) => {
		const users = JSON.parse(data);
		g_users.length = 0;
		users.forEach (elemnt => {
			g_users.push(elemnt);
		});
	});
}

function save_users()
{
	utils.save_data(FILE_PATH, JSON.stringify(g_users)).catch(err=> console.log(err));
}

//function exporting
module.exports=
{
    get_version :get_version,
    list_users: list_users,
    get_user: get_user,
    delete_user: delete_user,
    create_user: create_user,
    update_user: update_user,
    login: login,
    approve_user: approve_user,
    suspend_user: suspend_user,
    restore_user: restore_user,
    logout: logout,
    load_users: load_users,
    get_user_list: get_user_list,
    create_admin: create_admin
}
