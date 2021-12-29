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
const g_posts = [ {id:1, text: 'first MSG', creation_time: '17.03.2021', creator_id: 1  } ];
// API functions

// Version 
function get_version( req, res) 
{
	const version_obj = { version: package.version, description: package.description };
	res.send(  JSON.stringify( version_obj) );   
}

//--------LIST POSTS------
//create json with all of the posts
function list_posts( req, res) 
{
	res.send(JSON.stringify( g_posts));   //make js object to string
}

//--------GET POST------
function get_post( req, res )
{
	const id =  parseInt( req.params.id );

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad post id given")
		return;
	}

	const post =  g_posts.find( post =>  post.id == id )
	if ( !post)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such post")
		return;
	}

	res.send(  JSON.stringify( post) );   
}


//--------DELETE POST------
//Can be deleted only by the creator or admin
function delete_post( req, res )
{
	const id =  parseInt( req.params.id );
    const creator=req.body.creator_id;

	if ( id <= 0)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Bad post id given")
		return;
	}
    
	const idx =  g_posts.findIndex( post =>  post.id == id )
	if ( idx < 0 )
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such post")
		return;
	}
     //if not the creator or the admin try to delete that post
    if(creator_id != req.tokenData.id)
    {
        res.status( StatusCodes.UNAUTHORIZED );
		res.send( "No such post")
		return;
    }

	g_posts.splice( idx, 1 )
	res.send(  JSON.stringify( {}) );   
}

//--------CREATE POST------
//When a user create new post
function create_post( req, res )
{
    //need to add check if this user is active
    const text = req.body.text;
    const creation_time= new Date().toLocaleTimeString();
    const creator_id= req.body.creator_id;
	
	//check if full name field is not empty
	if ( !text)
	{
		res.status( StatusCodes.BAD_REQUEST );
		res.send( "Missing text in request")
		return;
	}
    
	// Find max id  & create unique ID
	let max_id = 0;
	g_posts.forEach(
		item => { max_id = Math.max( max_id, item.id) }
	)
	const new_id = max_id + 1;

	const new_post = { 
		id: new_id , 
		text: text,
		creation_time: creation_time,
        creator_id: creator_id
	};

	g_posts.push(new_post);
	res.send(JSON.stringify(new_post));   
}




// Routing
const router = express.Router();
router.get('/version', (req, res) => { get_version(req, res )  } );
router.get('/posts', (req, res) => { list_posts(req, res )  } )
router.post('/posts', (req, res) => { create_post(req, res )  } )
router.get('/post/(:id)', (req, res) => { get_post(req, res )  })
router.delete('/post/(:id)', (req, res) => { delete_post(req, res )  })

app.use('/api',router)


// Init 

let msg = `${package.description} listening at port ${port}`
app.listen(port, () => { console.log( msg ) ; });
