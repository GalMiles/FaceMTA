class Post extends React.Component {
    constructor(props) {
        super(props);
    }

    //create post button
    create_post() {
        this.props.update_posts();
    }

    render() {
        return React.createElement(
            'div',
            { className: 'Post' },
            React.createElement(
                'div',
                null,
                React.createElement(
                    'p',
                    null,
                    this.props.post.creation_time
                ),
                React.createElement(
                    'p',
                    null,
                    this.props.post.text
                )
            ),
            React.createElement('br', null)
        );
    }
}

export default Post;