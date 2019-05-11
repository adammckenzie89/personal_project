import React, { Component } from "react";
import { getSession } from "../../ducks/auth";
import { connect } from "react-redux";
import Header from "../header/Header";
// import Sharebutton from "../sharebutton/Sharebutton";
import "./favorites.scss";
import axios from "axios";

class Favorites extends Component {
  constructor() {
    super();

    this.state = {
      data: [],
      input: "",
      content: [],
      dropDown: []
    };
  }
  async componentDidMount() {
    this.props.getSession();

    await axios.get("/api/addFavorites").then(response => {
      console.log("FAVORITES: ", response);
      this.setState({
        data: response.data
      });
    });
    let arr = [];
    for (let i = 0; i < this.state.data.lenght; i++) {
      arr.push("closed");
    }
    this.setState({
      dropDown: arr
    });
    axios.get("/api/joinPosts").then(response => {
      console.log("POSTS: ", response);
      this.setState({
        content: response.data
      });
    });
  }
  dropDown = index => {
    let { dropDown } = this.state;
    console.log(this.state.dropDown);
    if (
      this.state.dropDown[index] === "closed" ||
      this.state.dropDown[index] === undefined
    ) {
      dropDown[index] = "open";
    } else {
      dropDown[index] = "closed";
    }
    this.setState({
      dropDown
    });
  };
  render() {
    console.log(this.state.content);
    return (
      <div>
        <Header />
        <div>
          <p className="welcomeUser">Welcome, {this.props.username}</p>
        </div>
        {this.state.data.map((val, index) => {
          return (
            <div className="everything">
              <div className="details" key={val.favoritesid}>
                <div className="card">
                  <div className="name_space">
                    <h2>{val.name}</h2>
                    <button
                      className="delete_card"
                      onClick={e =>
                        axios
                          .delete(`/api/deleteFavorite/${val.favoritesID}`)
                          .then(() => {
                            axios.get("/api/addFavorites").then(response => {
                              console.log(response);
                              this.setState({
                                data: response.data
                              });
                            });
                          })
                      }
                    >
                      X
                    </button>
                  </div>
                  <div className="details_space">
                    <h3>{val.address}</h3>
                    <h3>{val.number}</h3>
                    {val.website ? (
                      <a href={val.website}>{val.website.substr(7)}</a>
                    ) : null}
                    <h3> {val.rating} </h3>
                  </div>
                  <div className="comment_space">
                    <button onClick={() => this.dropDown(index)}>
                      Comments
                    </button>
                  </div>
                </div>
                <div className={`slide_${this.state.dropDown[index]}`}>
                  {console.log(this.state.dropDown[index])}
                  <form
                    onSubmit={() => {
                      axios
                        .post("/api/makePosts", {
                          content: this.state.input, //functionality for comments/ delete comments
                          favoritesid: val.favoritesID,
                          username: this.props.username,
                          time: new Date().toLocaleString()
                        })
                        .then(response => {
                          this.setState({
                            content: response.data
                          });
                        })
                        .then(() =>
                          axios.get("/api/joinPosts").then(response => {
                            this.setState({
                              content: response.data
                            });
                          })
                        );
                    }}
                  >
                    <input
                      className="inputStuff"
                      placeholder="Add comment"
                      onChange={e => this.setState({ input: e.target.value })}
                    />
                  </form>
                  <div className="comments">
                    {this.state.content.map(comment => {
                      if (val.address === comment.address) {
                        return (
                          <div>
                            {comment.time ? (
                              <p>
                                {comment.username}
                                <div>{comment.content}</div>{" "}
                                {comment.time.substr(0, 9)}{" "}
                                {comment.time.substr(11, 4)}{" "}
                                {comment.time.substr(18)}
                              </p>
                            ) : null}
                            {comment.id === this.props.id ? (
                              <button
                                className="deleteButton"
                                onClick={e =>
                                  axios
                                    .delete(`/api/removePost/${comment.postid}`)
                                    .then(() =>
                                      axios
                                        .get("/api/joinPosts")
                                        .then(response => {
                                          this.setState({
                                            content: response.data
                                          });
                                        })
                                    )
                                }
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = reduxState => {
  return {
    username: reduxState.auth.username,
    id: reduxState.auth.userID
  };
};

export default connect(
  mapStateToProps,
  { getSession }
)(Favorites);
