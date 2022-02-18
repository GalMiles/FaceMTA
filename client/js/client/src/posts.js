import Post from './post.js';

class Posts extends React.Component {
    constructor(props) {
        super(props);
    }

    create_post() {
        this.props.reset_posts();
    }

    render() {
        return React.createElement(
            'div',
            null,
            this.props.posts.map((item, index) => {
                return React.createElement(Post, { post: item, key: index });
            })
        );
    }
}

export default Posts;