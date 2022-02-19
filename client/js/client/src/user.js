class User extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                null,
                this.props.user.id
            ),
            React.createElement(
                "td",
                null,
                this.props.user.full_name
            ),
            React.createElement(
                "td",
                null,
                this.props.user.email
            ),
            React.createElement(
                "td",
                null,
                this.props.user.status
            )
        );
    }
}

export default User;