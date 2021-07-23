import React, { Component } from "react";

import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col } from "../../components/Grid";
// import { List, ListItem } from "../../components/List";
import { Modal, Row as MatRow } from "react-materialize";
import moment from "moment";
import "./Articles.css";

class Articles extends Component {
  state = {
    articles: [],
    articleId: "",
    articleTitle: "",
    noteTitle: "",
    noteBody: "",
    modalOpen: false,
  };

  componentDidMount() {
    console.log("Here!");
    this.loadArticles();
  }

  cancel = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        noteTitle: "",
        noteBody: "",
        modalOpen: false,
      };
    });
  };

  save = () => {
    console.log(this.state);
    API.saveNote({
      title: this.state.noteTitle,
      body: this.state.noteBody,
      date: moment().format("MMMM Do YYYY HH:mm:ss"),
    })
      .then((res) => {
        console.log(res);
        API.updateArticle(this.state.articleId, {
          $push: {
            notes: res.data._id,
          },
        })
          .then((res) => this.loadArticles())
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  loadArticles = () => {
    API.getArticles()
      .then((res) => {
        this.setState((prevState) => {
          return { ...prevState, articles: res.data };
        });
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  removeArticle = (id) => {
    API.deleteArticle(id)
      .then((res) => this.loadArticles())
      .catch((err) => console.log(err));
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  getNoteDiv = (e, artId) => {
    e.preventDefault();
    this.setState(
      (prevState) => {
        return { ...prevState, articleId: artId };
      },
      () => {
        console.log(this.state);
        API.getArticle(artId)
          .then((res) =>
            this.setState(
              (prevState) => {
                return { ...prevState, articleTitle: res.data.title };
              },
              () => {
                console.log(res.data);
                res.data.notes && res.data.notes.length > 0
                  ? API.getNote(res.data.notes[res.data.notes.length - 1]._id)
                      .then((res) => {
                        console.log(res.data);
                        this.setState(
                          (prevState) => {
                            return {
                              ...prevState,
                              noteTitle: res.data[0].title,
                              noteBody: res.data[0].body,
                            };
                          },
                          () => {
                            this.setState((prevState) => {
                              return {
                                ...prevState,
                                modalOpen: true,
                              };
                            });
                          }
                        );
                      })
                      .catch((err) => console.log(err))
                  : null;
              }
            )
          )
          .catch((err) => console.log(err));
      }
    );
  };

  render() {
    return (
      <MatRow>
        <Col size="s12">
          {this.state.articles.map((article) => (
            <MatRow key={article._id}>
              <Col
                size="s10"
                className="w3-card-4 z-index-4"
                style={{
                  border: "2px solid",
                  boxShadow: "2px 4px 10px 2px #2b2828",
                  flex: "none",
                  margin: "12px auto",
                }}
              >
                <MatRow style={{ paddingTop: "5px" }}>
                  <Col size="s9">
                    <Link to={article.link}>
                      <header className="w3-container w3-blue">
                        <h1>{article.title}</h1>
                      </header>
                    </Link>
                    <div className="w3-container">
                      <p>{article.summary}</p>
                    </div>
                  </Col>
                  <Col size="s3">
                    <Link to={article.link}>
                      <img
                        src={article.image}
                        className="rounded float-right img-thumbnail"
                        style={{ margin: "5px", minHeight: "50%" }}
                        alt="Article Thumbnail"
                      ></img>
                    </Link>
                  </Col>
                </MatRow>
                <footer id={article._id} className="w3-container w3-blue">
                  <h5>
                    {article.date}
                    <button
                      onClick={(e) => this.getNoteDiv(e, article._id)}
                      style={{ color: "black", float: "right" }}
                    >
                      Note
                    </button>
                  </h5>
                  {article.notes.map((note) => (
                    <h5
                      key={note._id}
                      style={{ color: "black", background: "floralwhite" }}
                    >
                      {note.date}
                      <br />
                      {note.title} : {note.body}
                    </h5>
                  ))}
                </footer>
              </Col>
            </MatRow>
          ))}
        </Col>
        <Modal
          id="modal1"
          header={this.state.articleTitle}
          fixedFooter
          open={this.state.modalOpen}
          style={{ maxHeight: "80%" }}
          actions={
            <div
              className="modal-footer"
              style={{ width: "100%", display: "block", paddingTop: "10px" }}
            >
              <button
                style={{ margin: "0 20px" }}
                onClick={this.cancel}
                className="modal-close waves-effect waves-red left"
              >
                Exit
              </button>
              {/* A button to submit a new note, with the id of the article saved to it */}
              <button
                style={{ margin: "0 10px" }}
                onClick={this.save}
                className="modal-close waves-effect waves-green right"
              >
                Save
              </button>
            </div>
          }
        >
          <br />
          {/* An input to enter a new title */}
          <input
            onChange={this.handleInputChange}
            value={this.state.noteTitle}
            name="noteTitle"
            placeholder="Subject"
            type="text"
          ></input>
          {/* A textarea to add a new note body */}
          <textarea
            onChange={this.handleInputChange}
            value={this.state.noteBody}
            name="noteBody"
            placeholder="Add a Note"
            type="text"
          ></textarea>
        </Modal>
      </MatRow>
    );
  }
}

export default Articles;
