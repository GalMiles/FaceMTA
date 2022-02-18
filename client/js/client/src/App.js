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
        };

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
        } else {
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

        if (email == "root@gmail.com") return true;else return false;
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
            case 'messages':
                return React.createElement(
                    'div',
                    { className: 'Messages' },
                    React.createElement(Messages, { cookie: this.state.cookie })
                );
            case 'about':
                return React.createElement(About, null);
            case 'manage_requests':
                return React.createElement(Users, { cookie: this.state.cookie });
            case 'logout':
                return React.createElement(Logout, { cookie: this.state.cookie });
            case 'posts':
            default:
                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'div',
                        { className: 'NewPost' },
                        React.createElement(NewPost, { cookie: this.state.cookie, update_list: this.update_list })
                    ),
                    React.createElement('br', null),
                    React.createElement(
                        'div',
                        { className: 'Posts' },
                        React.createElement(Posts, { posts: this.state.posts, reset_posts: this.reset_posts })
                    )
                );
        }
    }

    reset_posts() {
        this.fetch_posts();
    }

    render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'NavBar' },
                React.createElement(NavBar, { update_curr_page: this.update_curr_page, update_is_admin: this.update_is_admin, is_admin: this.state.is_admin })
            ),
            this.navigateTo()
        );
    }
}

export default App;