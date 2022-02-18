class Post extends React.Component {
    constructor(props) {
        super(props);
      
    }

    //create post button
    create_post() {
        this.props.update_posts();
    }

    
    render() {
        return (
            <div className='Post'>
                <div>
                    <p>{this.props.post.creation_time}</p>
                    <p>{this.props.post.text}</p>
                </div>
                <br></br>
			</div>
        );
    }
}

export default Post;