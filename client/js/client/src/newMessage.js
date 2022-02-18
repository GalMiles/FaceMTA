import MessageToAll from './messageToAll.js';

class NewMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            to: "",
            text: ""
        };

        this.handle_submit = this.handle_submit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    reset_values() {
        this.setState({ to: "" });
        this.setState({ text: " " });
    }

    async handle_submit(event) {
        event.preventDefault();
        const cook = this.props.cookie;
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            },
            body: JSON.stringify({
                text: this.state.text,
                to: this.state.to
            })
        });
        if (response.status == 200) {
            this.props.update_curr_page("messages");
            this.reset_values();
            this.props.fetch_messages();
        } else {
            const err = await response.text();
            alert(err);
        }
    }

    admin_menu() {
        if (this.props.is_admin) {
            return React.createElement(MessageToAll, { is_admin: this.props.is_admin, text: this.state.text, cookie: this.props.cookie });
        }
    }

    render() {
        return React.createElement(
            "div",
            null,
            React.createElement(
                "form",
                { onSubmit: this.handle_submit, className: "newMessage" },
                React.createElement("textarea", { onChange: this.handleChange, className: "to", name: "to", placeholder: "To", value: this.state.to }),
                React.createElement("br", null),
                React.createElement("textarea", { onChange: this.handleChange, className: "text", name: "text", placeholder: "Write a new message", value: this.state.text }),
                React.createElement("br", null),
                React.createElement(
                    "button",
                    { type: "submit", className: "btn" },
                    "Send"
                )
            ),
            this.admin_menu()
        );
    }
}

export default NewMessage;