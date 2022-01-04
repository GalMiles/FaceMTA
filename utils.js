
const StatusCodes = require('http-status-codes').StatusCodes;
const fs = require('fs').promises;



function check_token(token, req, res)
{
	//check if token exist 
	const found_token =g_users.find(element => element.token==token);
	if(!found_token)
	{
		res.status( StatusCodes.NOT_FOUND );
		res.send( "No such token")
		return false;
	}

	return found_token;
}

function get_id_from_token(req, res)
{
	const token = req.header('Authorization');
	const found_token = check_token(token, req, res);
	return found_token.id;
}

//load file to system
async function load_file(file_path)
{

	const data = await fs.readFile(file_path);
	return data;
}

//save data to file
async function save_data(file_path, data)
{
	await fs.writeFile(file_path, data)
}

//check if file doesn't exist do not load
// async function is_file_exist(file_path)
// {
// 	try{
		
// 		const file_details = fs.stat(file_path, (err) => {
// 			if(err)
// 				console.log(err);});	
// 		return true;
// 	}
// 	catch(e){
// 		return false;
// 	}
// }

module.exports=
{
    get_id_from_token: get_id_from_token,
    check_token: check_token,
    load_file: load_file,
    save_data: save_data
}