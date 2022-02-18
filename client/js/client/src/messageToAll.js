class MessageToAll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        };

        this.handle_click = this.handle_click.bind(this);
    }

    reset_values() {
        this.setState({ text: " " });
    }

    async handle_click(event) {
        event.preventDefault();
        const cook = this.props.cookie;
        const response = await fetch('/api/messages/forAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            },
            body: JSON.stringify({
                text: this.props.text
            })
        });

        if (response.status != 200) {
            const err = await response.text();
            alert(err);
        }
    }

    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "div",
                { className: "MessageToAll" },
                React.createElement(
                    "button",
                    { onClick: this.handle_click, className: "btn" },
                    "Send To All Users"
                )
            )
        );
    }
}

export default MessageToAll;