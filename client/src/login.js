
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.name == "email") {
      this.setState({ email: event.target.value })
    }
    else
      this.setState({ password: event.target.value })
  }

  async handleSubmit(event) {
    event.preventDefault();
    const res = await this.handle_login();

  }

  //login method
  async handle_login() {
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      })
    });
    if (response.status == 200) {
      const json = await response.json();
      this.set_cookie(this.state.email,json);
      window.location = '../home/index.html';
    }
    else {
      const err = await response.text();
      alert(err);
    }
  }

  //set cookie in browser
  set_cookie(name, value) {
    document.cookie = name + "=" + value + ";path=/";
  }

  // set_cookie(token) {
  //   document.cookie = token;
  // }


  get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group row">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <div className="col-sm-5">
            <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="exampleInputPassword1">Password</label>
          <div className="col-sm-5">
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    );

  }
}

