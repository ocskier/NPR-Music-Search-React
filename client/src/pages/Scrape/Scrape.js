import React, { Component } from "react";

import API from "../../utils/API";

import { Col } from "../../components/Grid";
import { Row as MatRow } from "react-materialize";

import "./Scrape.css";

class Scrape extends Component {
  state = {
    articles: [],
    articlesAdded: [],
  };

  scrapeArticles = (e) => {
    e.preventDefault();
    API.getScrape()
      .then((res) => {
        console.log(res);
        this.setState({ articles: res.data }, () => console.log(this.state));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // this.props.artBool();

  addArticle = (e) => {
    e.preventDefault();
    const el = e.target;

    API.makeArticle(this.state.articles[el.id])
      .then((res) => {
        const tempArr = this.state.articlesAdded;
        tempArr.push(el.id);
        this.setState({
          articlesAdded: tempArr,
        });
      })
      .catch((err) => console.log(err));
  };

  checkSaved = (index) => {
    let tempArr = this.state.articlesAdded;
    const isSaved = tempArr.find((article) => Number(article) === index);
    isSaved && console.log(isSaved);
    return isSaved;
  };

  render() {
    return (
      <div>
        <div className="row justify-content-center">
          <button
            onClick={this.scrapeArticles}
            type="button"
            className="btn btn-info"
          >
            Scrape
          </button>
        </div>
        <MatRow>
          <Col size="s12">
            {this.state.articles.map((article, index) => (
              <MatRow key={index}>
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
                      <a href={article.link}>
                        <header className="w3-container w3-blue">
                          <h1>{article.title}</h1>
                        </header>
                      </a>
                      <div className="w3-container">
                        <p>{article.summary}</p>
                      </div>
                    </Col>
                    <Col size="s3">
                      <a href={article.link}>
                        <img
                          src={article.image}
                          className="rounded float-right img-thumbnail"
                          style={{ margin: "5px", minHeight: "50%" }}
                          alt="Article Thumbnail"
                        ></img>
                      </a>
                    </Col>
                  </MatRow>
                  <footer className="w3-container w3-blue">
                    <h5>
                      {article.date}
                      <button
                        onClick={this.addArticle}
                        id={index}
                        style={{ color: "black", float: "right" }}
                      >
                        {this.checkSaved(index) ? "Added" : "Save"}
                      </button>
                    </h5>
                  </footer>
                </Col>
              </MatRow>
            ))}
          </Col>
        </MatRow>
      </div>
    );
  }
}

export default Scrape;
