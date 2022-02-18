import ApproveUsers from './approveUsers.js';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currNav: ""
        };

        this.handle_click = this.handle_click.bind(this);
    }

    handle_click(event) {
        event.preventDefault();
        this.props.update_curr_page(event.target.name);
    }

    //add admin's buttons
    admin_menu() {
        if (this.props.is_admin) {
            return React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "li",
                    null,
                    React.createElement(
                        "a",
                        { href: "#", onClick: this.handle_click, name: "manage_requests" },
                        React.createElement("i", { className: "fa fa-check" }),
                        " Manage"
                    )
                )
            );
        }
    }

    render() {
        return React.createElement(
            "div",
            { className: "col-md-12 text-center" },
            React.createElement(
                "div",
                { className: "banner-area" },
                React.createElement(
                    "nav",
                    null,
                    React.createElement(
                        "ul",
                        null,
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#", onClick: this.handle_click, name: "posts" },
                                React.createElement("i", { className: "fa fa-home" }),
                                " Home"
                            )
                        ),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#", onClick: this.handle_click, name: "messages" },
                                React.createElement("i", { className: "fa fa-envelope" }),
                                " Messages"
                            )
                        ),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#", onClick: this.handle_click, name: "about" },
                                React.createElement("i", { className: "fa fa-user-o" }),
                                " About"
                            )
                        ),
                        React.createElement(
                            "li",
                            null,
                            React.createElement(
                                "a",
                                { href: "#", onClick: this.handle_click, name: "logout" },
                                React.createElement("i", { className: "fa fa-key" }),
                                " Logout"
                            )
                        ),
                        this.admin_menu()
                    )
                )
            )
        );
    }
}

export default NavBar;