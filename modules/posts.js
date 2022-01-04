
const StatusCodes = require('http-status-codes').StatusCodes;
const utils = require('../utils');
const FILE_PATH = './files/posts.json';


// Posts's table
const g_posts = [];

//------------------------------------
//			API FUNCTIONS
//------------------------------------

//--------LIST POSTS------
//create json with all of the posts
function list_posts( req, res) 
{
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);

	if(found_token)
	{
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(g_posts) );   //make js object to string 
	}
	else
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only logon user can get this request!");
	}
}

//--------CREATE POST------
//When a user create new post
function create_post( req, res )
{

	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);
	const creator_id = utils.get_id_from_token(req, res);
	const text = req.body.text;
    const creation_time= new Date().toLocaleTimeString();

	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send("Only login user can get this request!");
	}
	else
	{
		//check if text field is not empty
		if (!text)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send("Missing text in request")
			return;
		}
		
		// Find max id  & create unique ID for post
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
		res.status( StatusCodes.OK ); 
		res.send(JSON.stringify(new_post));  
		save_posts();
	}
	
}

//--------DELETE POST------
//Can be deleted only by the creator or admin
function delete_post( req, res )
{
	const id =  parseInt( req.params.id );
    const creator_id=req.body.creator_id;
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);
	const token_id = get_id_from_token(req, res);
	if(!found_token || token_id.id !=1) //if not login user or admin
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login of admin user can get this request!");
	}
	else
	{		
		if ( id <= 0)
		{
			res.status( StatusCodes.BAD_REQUEST );
			res.send( "Bad post id given")
			return;
		}
		//check if id exist
		const idx =  g_posts.findIndex( post =>  post.id == id )
		if ( idx < 0 )
		{
			res.status( StatusCodes.NOT_FOUND );
			res.send("No such post")
			return;
		}
		//only admin or if the curr user is the creator can delete post.
		if(creator_id == token_id || token_id === 1)
		{
			g_posts.splice( idx, 1 );
			res.status( StatusCodes.OK ); 
			res.send( JSON.stringify( `The post with id: ${id} was deleted!`)); 
		}
		else
		{
			res.status( StatusCodes.UNAUTHORIZED );
			res.send( "You can't delete this post!")
			return;
		}
		save_posts();
	}
}

//--------GET POST------
function get_post( req, res )
{
	const id =  parseInt( req.params.id );
	const token = req.header('Authorization');
	const found_token = utils.check_token(token, req, res);

	if(!found_token)
	{
		res.status( StatusCodes.UNAUTHORIZED );
		res.send( "Only login user can get this request!");
	}
	else{
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
		res.status( StatusCodes.OK );
		res.send( JSON.stringify(post) ); 
	}  
}

//------------------------------------
//			FILES FUNCTIONS
//------------------------------------
function load_posts()
{
	utils.load_file(FILE_PATH).then((data) => {	
		const posts = JSON.parse(data);
		g_posts.length = 0;
		posts.forEach (elemnt => {
			g_posts.push(elemnt);
		});
	});
}

//save posts
function save_posts()
{
	utils.save_data(FILE_PATH, JSON.stringify(g_posts)).catch(err=> console.log(err));
}


module.exports = {
	list_posts: list_posts,
	create_post: create_post,
	delete_post: delete_post,
	get_post: get_post, 
	load_posts: load_posts,
}