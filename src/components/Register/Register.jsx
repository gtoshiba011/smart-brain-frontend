import React, { Component } from "react";

class Register extends Component {
  state = {
    registerName: "",
    registerEmail: "",
    registerPassword: "",
  };

  nameChangeHandler = (event) => {
    this.setState({ registerName: event.target.value });
  };
  emailChangeHandler = (event) => {
    this.setState({ registerEmail: event.target.value });
  };
  passwordChangeHandler = (event) => {
    this.setState({ registerPassword: event.target.value });
  };
  submitRegisterHandler = () => {
    fetch("http://localhost:3000/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: this.state.registerName,
        email: this.state.registerEmail,
        password: this.state.registerPassword,
      }),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.id) {
          this.props.onUpdateUser(user);
          this.props.onRouteChange("home");
        } else {
          console.log("register error");
        }
      })
      .catch(console.log);
  };

  render() {
    return (
      <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="hover-black pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.nameChangeHandler}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="hover-black pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.emailChangeHandler}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="hover-black pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.passwordChangeHandler}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
                onClick={this.submitRegisterHandler}
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
