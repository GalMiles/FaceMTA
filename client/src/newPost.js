class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text:""
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
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            },
            body: JSON.stringify({
                text: this.state.text,
                })
            });
            if ( response.status == 200 )
                {
                    const posts = await response.json();
                    window.location.reload(false);	
                }
            else 
            {
                const err = await response.text();
                alert( err );
            }

    }

    render() {
        return (
            <div>
                <form onSubmit={this.handle_submit} className="newPost">
                    <textarea onChange={this.handleChange} name="text" placeholder="Write a new post" value={this.state.text}></textarea>
                    <br></br>
                    <button type="submit" className="btn">Post</button>

                </form>
            </div>
        );
    }
}

export default NewPost;