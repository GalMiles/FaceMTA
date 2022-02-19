class User extends React.Component {
    constructor(props) {
        super(props);
    
    }
    
    render() {
        return ( 
            <tr>
                <td>{this.props.user.id}</td>
                <td>{this.props.user.full_name}</td>
                <td>{this.props.user.email}</td>
                <td>{this.props.user.status}</td>
            </tr>
        );
    }
}

export default User;