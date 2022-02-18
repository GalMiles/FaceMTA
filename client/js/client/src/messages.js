import Message from './message.js';
import NewMessage from './newMessage.js';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            message_to_all: ""
        };

        this.fetch_messages = this.fetch_messages.bind(this);
        this.handle_click = this.handle_click.bind(this);
        this.update_message_to_all = this.update_message_to_all.bind(this);
    }

    async componentDidMount() {
        this.fetch_messages();
    }

    update_list(messages) {
        this.setState({ messages: messages });
    }

    update_message_to_all(message_to_all) {
        this.setState({ message_to_all: message_to_all });
    }

    // get_cookie() {
    //     const value = document.cookie;
    //     const parts = value.split('=');
    //     return parts[1];
    // }


    async handle_click() {
        const cook = this.props.cookie;
        const res = await fetch('/api/messages/forAll', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            },
            body: JSON.stringify({
                text: this.state.message_to_all
            })
        });

        if (res.status == 200) {

            const messages = await res.json();
            const reverse_messages = messages.reverse();
            const n_messages = reverse_messages.slice(0, 6);
            this.update_list(n_messages);
        } else {
            const err = await res.text();
            alert(err);
        }
    }

    async fetch_messages() {
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
        } else {
            const err = await res.text();
            alert(err);
        }
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'NewMessage' },
                React.createElement(NewMessage, { cookie: this.props.cookie, is_admin: this.props.is_admin, update_list: this.update_list, update_curr_page: this.props.update_curr_page, fetch_messages: this.fetch_messages, update_message_to_all: this.update_message_to_all })
            ),
            React.createElement('br', null),
            React.createElement(
                'div',
                null,
                this.state.messages.map((item, index) => {
                    return React.createElement(Message, { message: item, key: index });
                })
            )
        );
    }
}

export default Messages;