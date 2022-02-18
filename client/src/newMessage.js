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
            const messages = await response.json();
            window.location.reload(false);
        }
        else {
            const err = await response.text();
            alert(err);
        }

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handle_submit} className="newMessage">
                    <textarea onChange={this.handleChange} className="to" name="to" placeholder="To" value={this.state.to}></textarea>
                    <br></br>
                    <textarea onChange={this.handleChange} className="text"name="text" placeholder="Write a new message" value={this.state.text}></textarea>
                    <br></br>
                    <button type="submit" className="btn">Send</button>
                    <br></br>

                </form>
            </div>
        );
    }
}

export default NewMessage;