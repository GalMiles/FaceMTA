class Message extends React.Component {
    constructor(props) {
        super(props);
      
    }

    
    render() {
        return (
            <div className='Message'>
                <div>
                    <p>{this.props.message.creation_time}</p>
                    <p>From:{this.props.message.from}</p>
                    <p>{this.props.message.text}</p>
                </div>
                <br></br>
			</div>
        );
    }
}

export default Message;