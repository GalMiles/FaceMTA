import Message from './message.js';
import NewMessage from './newMessage.js';

class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }

    }

    async componentDidMount() {
        this.fetch_messages();
    }


    update_list(messages) {
        this.setState({ messages: messages });
    }

    // get_cookie() {
    //     const value = document.cookie;
    //     const parts = value.split('=');
    //     return parts[1];
    // }



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

        }
        else {
            const err = await res.text();
            alert(err);

        }
    }

    render() {
        return (
            <div>
                <div className='NewMessage'>
                    <NewMessage cookie={this.props.cookie} update_list={this.update_list} update_curr_page={this.props.update_curr_page} />
                </div>
                <div>
                    {this.state.messages.map((item, index) => { return <Message message={item} key={index} /> })}
                </div>
            </div>
        );
    }
}

export default Messages;