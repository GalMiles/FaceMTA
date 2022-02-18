
class Logout extends React.Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        this.handle_logout();
      }

    async handle_logout() {
        const cook = this.props.cookie;
      const response = await fetch('/api/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            }
        });
        if (response.status == 200) {
            window.location = '../login/index.html';
        }
        else {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return (
            <div>
                <p>You logged out</p>
            </div>
        );

    }
}

export default Logout;

