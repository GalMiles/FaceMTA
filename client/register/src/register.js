
class Register extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          name: "",
          email: "",
          password: "",
          next_page:""
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        if(event.target.name == "email")
        {
             this.setState({email: event.target.value})
        }
        else if(event.target.name == "password")
        {
            this.setState({password: event.target.value})             
        }
        else
            this.setState({name: event.target.value})
      }
  
    async handleSubmit(event) {
      await this.handle_register();
    }

    async fetch_users()
	{
		const response = await fetch('/api/users');
		if ( response.status != 200 )
		  throw new Error( 'Error while fetching users');
		const data = await response.json();
		return data;
	}

    update_list( users )
	{
		this.setState( {users : users} );
	}

    async handle_register()
	{
        const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            })
        });
        if ( response.status == 200 )
            {
                const users = await response.fetch_users();	
                this.update_list(users); 
                this.state.next_page = "login"
            }
        else 
        {
            const err = await response.text();
            this.state.next_page="register"
            alert( err );
        }
	}

    renderHelper(){
        return(   
            <form onSubmit={this.handleSubmit}>
                <label for="exampleInputName">Full Name</label>
                <div className="form-group row col-sm-5">
                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" id="exampleInputName"  placeholder="Full Name"/>
                    <label for="exampleInputEmail1">Email</label>
                    <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email Address"/>
                    <label for="exampleInputEmail1">Password</label>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>)
    }
    renderLinks(){
        if(this.state.next_page=="login")
        {
            return <a href="http://localhost:2718/login/index.html"></a>
        }
        else
        {
            return <a href="http://localhost:2718/register/index.html"></a>
        }
    }
   
    render() {
        return ( 
        <div>
            {this.renderHelper()}
            {this.renderLinks()}
        </div>
        );
      }
}