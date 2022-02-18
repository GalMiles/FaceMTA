import ApproveUsers from './approveUsers.js';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currNav: ""
        }

        this.handle_click = this.handle_click.bind(this);
    }


    handle_click(event) {
        event.preventDefault();
        this.props.update_curr_page(event.target.name);
    }

    //add admin's buttons
    admin_menu() {
        if ( this.props.is_admin ) {
            return (
                <React.Fragment>
                    <li><a href="#" onClick={this.handle_click} name="manage_requests"><i className="fa fa-tasks"></i> Manage</a></li>
                </React.Fragment>
            );
        }
    }

    render() {
        return (
            <div className="col-md-12 text-center">
                <div className="banner-area">
                    <nav>
                        <ul>
                            <li><a href="#" onClick={this.handle_click} name="posts"><i className="fa fa-home"></i> Home</a></li>
                            <li><a href="#" onClick={this.handle_click} name="messages"><i className="fa fa-envelope"></i> Messages</a></li>
                            <li><a href="#" onClick={this.handle_click} name="about"><i className="fa fa-user-o"></i> About</a></li>
                            <li><a href="#" onClick={this.handle_click} name="logout"><i className="fa fa-sign-out"></i> Logout</a></li>
                            {this.admin_menu()}

                        </ul>
                    </nav>

                </div>
            </div>

        )


    }
}

export default NavBar;