class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return React.createElement(
            'div',
            { className: 'Message' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    this.props.message.creation_time
                ),
                React.createElement(
                    'p',
                    null,
                    'To:',
                    this.props.message.to
                ),
                React.createElement(
                    'p',
                    null,
                    this.props.message.text
                )
            ),
            React.createElement('br', null)
        );
    }
}

export default Message;