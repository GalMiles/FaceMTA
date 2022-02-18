class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            users = []
        }
      
    }

    async componentDidMount() {
        this.fetch_users();
    }

    update_list(users) {
        this.setState({ users: users });
    }


    async fetch_users() {
        const cook = this.props.cookie;
        const res = await fetch('/api/messages', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            }
        });

        if (res.status == 200) {

            const messages = await res.json();
            const reverse_messages = messages.reverse();
            const n_messages = reverse_messages.slice(0, 6);
            this.update_list(n_messages);

        }
        else {
            const err = await res.text();
            alert(err);

        }
    }

    render() {
        return (
          null
        );
    }
}

export default Users;