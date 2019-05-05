import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "./header.module.scss";
import { connect } from "react-redux";
import { logOut } from "../../ducks/auth";
import styles from "./header.module.scss";
import Axios from "axios";

class Header extends Component {
  constructor() {
    super();
  }
  render() {
    if (!this.props.auth.username) {
      return <Redirect to="/" push={true} />;
    }
    console.log(this.props);
    return (
      <div>
        <nav>
          <Link to="/places">
            <h3>Places</h3>
          </Link>
          <Link to="/favorites">
            <h3>Favorites</h3>
          </Link>
          <Link to="search">
            <h3>Search</h3>
          </Link>
          <div>
            <h3
              onClick={() => {
                this.props.logOut();
                window.location.reload();
              }}
            >
              Log out
            </h3>
          </div>
        </nav>
      </div>
    );
  }
}

const mapStateToProps = reduxState => reduxState;

export default connect(
  mapStateToProps,
  { logOut }
)(Header);