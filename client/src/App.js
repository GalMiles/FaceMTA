import Posts from './posts.js';
import NewPost from './newPost.js';
import NavBar from './navBar.js';
import About from './about.js';
import Users from './Users.js';
import Messages from './messages.js';
import Logout from './logout.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            curr_page: "",
            cookie: "",
            is_admin: false
        }

        this.reset_posts = this.reset_posts.bind(this);
        this.update_list = this.update_list.bind(this);
        this.update_curr_page = this.update_curr_page.bind(this);
        this.update_is_admin = this.update_is_admin.bind(this);

    }

    async componentDidMount() {
        this.update_is_admin();
        this.reset_posts();
    }

    async fetch_posts() {
        const cook = this.get_cookie();
        const res = await fetch('/api/posts', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': cook
            }
        });

        if (res.status == 200) {

            const posts = await res.json();
            const reverse_posts = posts.reverse();
            const n_posts = reverse_posts.slice(0, 6);
            this.update_list(n_posts);
            this.update_cookie(cook);

        }
        else {
            const err = await res.text();
            alert(err);

        }
    }

    update_list(posts) {
        this.setState({ posts: posts });
    }

    update_cookie(cookie) {
        this.setState({ cookie: cookie });

    }

    get_user_email() {
        const value = document.cookie;
        const parts = value.split('=');
        const email = parts[0];

        if (email == "root@gmail.com")
            return true;
        else
            return false;
    }

    update_is_admin() {
        const is_admin = this.get_user_email();
        this.setState({ is_admin: is_admin });

    }

    update_curr_page(page) {
        this.setState({ curr_page: page });
    }

    get_cookie() {
        const value = document.cookie;
        const parts = value.split('=');
        return parts[1];
    }

    
    navigateTo() {
        switch (this.state.curr_page) {
            case 'messages': return (
                <div className='Messages'>
                    <Messages cookie={this.state.cookie} update_curr_page={this.update_curr_page} is_admin={this.state.is_admin}/>
                </div>);
            case 'about': return <About />;
            case 'manage_requests': return <Users cookie={this.state.cookie}/>;
            case 'logout': return <Logout cookie={this.state.cookie}/>;
            case 'posts':
            default:
                return (
                    <div>
                        <div className='NewPost'>
                            <NewPost cookie={this.state.cookie} update_list={this.update_list} />
                        </div>
                        <br></br>
                        <div className='Posts'>
                            <Posts posts={this.state.posts} reset_posts={this.reset_posts} />
                        </div>
                    </div>
                );
        }
    }

    reset_posts() {
        this.fetch_posts();
    }

    render() {
        return (
            <div>
                <div className='NavBar'>
                    <NavBar update_curr_page={this.update_curr_page} update_is_admin={this.update_is_admin} is_admin={this.state.is_admin} />
                </div>
                {this.navigateTo()}
            </div>
        );
    }
}

export default App;