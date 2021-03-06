import React, { Component } from "react";
import { getSession, editProfile, login } from "../../ducks/auth";
import { connect } from "react-redux";
import Header from "../header/Header";
import styles from "./profile.module.scss";
import logo from "./logo.png";

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      email: ""
    };
  }
  componentDidMount() {
    this.props.getSession();
  }

  handleClick = e => {
    e.preventDefault();
    const { username, password, email } = this.state;
    const session = this.props.username;
    this.props.editProfile(session, username, email);
    this.props.login(username, password);
  };

  render() {
    return (
      <div>
        <Header />
        {/* <div>
          <p className={styles.welcomeUser}>Welcome, {this.props.username}</p>
        </div> */}
        <div className={styles.inputContainer}>
          <div className={styles.outerDiv}>
            <div className={styles.changeInfo}>
              <h3>Change your username here {this.props.username}</h3>
            </div>
            <input
              onChange={e => this.setState({ username: e.target.value })}
              placeholder="username"
            />
            <input
              onChange={e => this.setState({ email: e.target.value })}
              placeholder="email"
            />
            <input
              onChange={e => this.setState({ password: e.target.value })}
              placeholder="current password"
            />
            <br />
            <button onClick={e => this.handleClick(e)}>Submit</button>
            <div className={styles.logoContainer}>
              <img className={styles.logo} src={logo} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    username: reduxState.auth.username
  };
};

export default connect(
  mapStateToProps,
  { getSession, editProfile, login }
)(Profile);
