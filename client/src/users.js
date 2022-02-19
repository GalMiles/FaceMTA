import User from './user.js';

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            users = []
        }
        this.handle_click = this.handle_click.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    async componentDidMount() {
        this.fetch_users();
    }

    update_list(users) {
        this.setState({ users: users });
    }

    async fetch_users() {
        const cook = this.props.cookie;
        const res = await fetch('/api/users', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            }
        });
    }

    async handle_click(id)
	{
		const response = await fetch('/api/user/' + id , {method:'GET'});
		if ( response.status == 200 )
		{
			const user = await response.json();
            const buttonDel = document.querySelector('delete')
            const buttonSus = document.querySelector('suspend')
            const buttonAct = document.querySelector('activate')
            if (user.status == 'deleted')
            {
                buttonDel.setState({isDisabled: true});
                buttonSus.setState({isDisabled: true});
                buttonAct.setState({isDisabled: true});
            }
                
            if (user.status=='suspended')
            {
                buttonDel.setState({isDisabled: false});
                buttonSus.setState({isDisabled: true});
                buttonAct.setState({isDisabled: false});
            }
            if (user.status=='active')
            {
                buttonDel.setState({isDisabled: true});
                buttonSus.setState({isDisabled: true});
                buttonAct.setState({isDisabled: false});
            }
            //const users = await this.fetch_users();
            
			//this.update_list(users);		  
		}
		else 
		{
		  const err = await response.text();
		  alert( err );
		}
	}

    async handle_Approve_Clicked(id)
    {
        event.preventDefault();
        const response = await fetch('/api/user/approve/'+ id , {
            method: 'PUT'
            });
            if ( response.status == 200 )
                {
                    const users = await response.json();
                    update_list(users);
                    window.location.reload(false);	
                }
            else 
            {
                const err = await response.text();
                alert( err );
            }

    }
    
    async handle_Suspend_Clicked(id)
    {
        const response = await fetch('/api/user/suspend/'+id, {
            method: 'PUT'
            });
            if ( response.status == 200 )
                {
                    const users = await response.json();
                    update_list(users);
                    window.location.reload(false);	
                }
            else 
            {
                const err = await response.text();
                alert( err );
            }
    }

    async handle_Activate_Clicked(id)
    {
        const response = await fetch('/api/user/restore/'+id, {
            method: 'PUT'
            });
            if ( response.status == 200 )
                {
                    const users = await response.json();
                    update_list(users);
                    window.location.reload(false);	
                }
            else 
            {
                const err = await response.text();
                alert( err );
            }
    }
    render() {
        return (
            <div style="overflow-x:auto;">
                <table>
                <tr>
                    <th>id</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>status</th>
                </tr>
                    {this.props.users.map( (item,index) => { return <User user={item} key = {index} /> }  ) }
                </table>
                <br></br>
                
                    <button type="approve" className="btn" 
                        disabled
                        onClick={this.handle_Approve_Clicked.bind(this)}>
                        approve user
                    </button>
                <br></br>
                    <button type="suspend" className="btn" 
                        disabled 
                        onClick={this.handle_Suspend_Clicked.bind(this)}>
                            suspend user
                    </button>
                <br></br>
                    <button type="activate" className="btn" 
                        disabled
                        onClick={this.handle_Activate_Clicked.bind(this)}>
                            activate user
                    </button>
            </div>
        );
    }
}

export default Users;