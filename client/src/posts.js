import Post from './post.js';

class Posts extends React.Component {
    constructor(props) {
        super(props);
      
    }

    create_post() {
        this.props.reset_posts();
    }

  
    render() {
        return (
            <div>
                {this.props.posts.map( (item,index) => { return <Post post={item} key = {index} /> }  ) }
            </div>
        );
    }
}

export default Posts;