
// class ActivateButton extends React.Component {
// 	constructor(props) {
// 	  super(props);
// 	  this.handle_click = this.handle_click.bind( this );
// 	}
  
// 	async handle_click()
// 	{
// 		{
// 			if ( this.props.handle_activate )
// 			  this.props.handle_activate( this.props.user.id );
// 		}
// 	}

// 	render() {
// 	  return (
// 	  	<div className="ActivateButton" data-id={this.props.user.id}>
// 			<span><i onClick={this.handle_click}></i></span>
// 		  	<button>{this.props.name}</button>
// 		</div>)
// 	}
//   }
  

class UserItem extends React.Component 
{
	constructor(props) {
		super(props);
		this.handle_click = this.handle_click.bind( this );
	}

	//the UserItem child transfer the event to the parent whom has a props handle_activate
	handle_click()
	{
		{
			if ( this.props.handle_activate )
			  this.props.handle_activate( this.props.user.id );
		}
	}

	render() {
		return 	<div className='UserItem'  data-id={this.props.user.id}>
					<span><button onClick={this.handle_click}> Activate </button></span>
					<h1>{this.props.user.full_name} </h1>
					<p>Status: {this.props.user.status}</p>
					
				</div>
	}
}


class UserList extends React.Component 
{
	constructor(props) 
	{
		super(props);
		this.handle_activate = this.handle_activate.bind( this );
		this.state = {
			users: [],
			cookies: ""
		}
	}

	async componentDidMount() 
	{
		const users = await this.fetch_users();
		this.update_list(users);
	}

	// componentSetCookies() 
	// {
	//   const userCookie = this.get_cookie( this.props.user.email);
	//   this.setState( {cookies : userCookie} );

	// }

	get_cookie() {
		const value = document.cookie;
		const parts = value.split('=');
		return parts[1];
	  }

	async handle_activate(id)
	{
		const cook = this.get_cookie();
		const response = await fetch('/api/user/approve/' + id , {
			method:'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization' : cook }});
		if ( response.status == 200 )
		{
			const users = await this.fetch_users();
			this.update_list(users);		  
		}
		else 
		{
		  const err = await response.text();
		  alert( err );
		}
	}

	async fetch_users()
	{
		const response = await fetch('/api/users');
		if ( response.status != 200 )
		  throw new Error( 'Error while fetching users');
		const data = await response.json();
		return data;
	}

	async handle_delete( id )
	{
		const response = await fetch('/api/user/' + id , {method:'DELETE'});
		if ( response.status == 200 )
		{
			const users = await this.fetch_users();
			this.update_list(users);		  
		}
		else 
		{
		  const err = await response.text();
		  alert( err );
		}
	}


	update_list( users )
	{
		this.setState( {users : users} );
	}

	render() {
		return <div>
			   {this.state.users.map( (item,index) => { return  <UserItem 
						handle_activate={this.handle_activate} user={item}  key={index}/>  }  ) }
			   </div>
	}
}
