import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { format } from "timeago.js";
import '../App.css'
import { franc } from "franc";
const View = () => {
  const [articles, setArticles] = useState([]);
  const [Message, setMessage] = useState("");
  const [isComment, setIsComment] = useState([]);
  const [created, setCreated] = useState(true);
  const [commented, setCommented] = useState(true);
  const [loader, setLoader] = useState(false);

  // change document title

  useEffect(() => {
    // Set the initial tab title when the component mounts
    document.title = "Blogs";
  });
  const handleComment = async (e) => {
    e.preventDefault();
    let id = e.target.getAttribute("article_id");
    let inputarea = e.target.commentArea.value;
    const comment = {
      articleID: id,
      articleComment: inputarea,
    };
    await axios
      .post("http://localhost:3002/saveComments", comment)
      .then((res) => {
        setCommented(true);
        setMessage(res.data.message);
      });
    e.target.reset();
  };

  //  get articles

  useEffect(() => {
    setLoader(true);
    if (created) {
      setCreated(false);
      fetch("http://localhost:3002/articles")
        .then((res) => res.json())
        .then((data) => {
          setLoader(false);
          setArticles(data.articles);
        });
    }
  }, [created]);

  // get comments :

  useEffect(() => {
    if (commented) {
      setCommented(false);
      fetch("http://localhost:3002/getComments")
        .then((res) => res.json())
        .then((data) => setIsComment(data));
    }
  }, [commented]);

  const handleShow = (e) => {
    const btn = e.target;
    const collapsed = e.target.parentElement.children[3];
    if (collapsed.classList.contains("active")) {
      btn.innerHTML = "Comments and more...";
      collapsed.classList.remove("active");
    } else {
      btn.innerHTML = "View less";
      collapsed.classList.add("active");
    }
  };

  // language verification

  useEffect(() => {
    const text = document.querySelectorAll(".paragraphe");
    if (text) {
      text.forEach((t) => {
        const language = franc(t.textContent);
        if (language === "arb") {
          t.style.textAlign = "right";
        } else {
          t.style.textAlign = "left";
        }
      });
    }
  });
  return (
    <div>
      <div className="container bg-transparent m-3 d-flex flex-column justify-content-center align-items-center">
        {Message === "comment published !" ? (
          <div className="alert alert-success ">{Message}</div>
        ) : (
          <span></span>
        )}

        {Message === "Error ! try agin !" ? (
          <div className="alert alert-danger ">{Message}</div>
        ) : (
          <span></span>
        )}
      </div>
      <div className="mt-3 p-2  h-100 d-flex flex-column article-container">
        {loader ? (
          <div className="user-chat d-flex flex-row justify-content-center text-light align-items-center">
            loading{" "}
            <div class="spinner-border text-light ms-3 " role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : articles.length !== 0 ? (
          articles.map((art) => (
            <div
              class="card text-center h-25 m-auto  mb-4 article-card text-light"
              style={{ margin: "10px" }}
            >
              <div className="card-header text-danger">BLOGS</div>
              <div className="card-body">
                <h5 className="card-title text-info fw-bold">{art.title}</h5>
                <p
                  className="card-text text-light paragraphe"
                  style={{ filter: "blur(2)" }}
                >
                  {art.body}
                </p>
              </div>
              {/* collapsed content */}
              <NavLink
                className="text-decoration-underline mb-3 btn-collapse"
                onClick={handleShow}
              >
                Comments and more...
              </NavLink>

              <div className="collapsed">
                <hr />
                <div className="card-footer text-muted d-flex flex-column flex-lg-row justify-content-center align-items-center">
                  <span className="card bg-transparent text-success border rounded-5 p-2 me-2 mb-2">
                    {" "}
                    Posted : {format(art.createdAt)}{" "}
                  </span>
                  <span className="card bg-transparent text-primary border rounded-5 p-2 mb-2 ">
                    {" "}
                    Modified : {format(art.updatedAt)}{" "}
                  </span>
                </div>

                <div className="p-3">
                  <form
                    data-mdb-input-init
                    className="form-floating  p-2 bg-transparent border form mb-4 d-flex flex-row justify-content-between align-items-center  input  bg-light"
                    style={{ borderRadius: "30px", width: "100%" }}
                    article_id={art._id}
                    onSubmit={handleComment}
                  >
                    <input
                      type="search"
                      id="commentArea"
                      className="form rounded-0 bg-transparent  text-light "
                      placeholder="Add comment..."
                      required
                    />

                    <button className="comment-btn shadow-0" type="submit"
                    style={{width :'30px' , height:'30px'}}
                    >
                      <i class="fas fa-arrow-up-long"></i>
                    </button>
                  </form>
                </div>
                <div className="d-flex flex-column">
                  {" "}
                  <p className="text-decoration-underline text-warning">
                    Comments :
                  </p>
                  {isComment.map((comm) =>
                    comm.articleID === art._id ? (
                      <span
                        className="  text-secondary border p-1  m-2 "
                        style={{
                          maxWidth: "max-content",
                          filter: "blur(3)",
                          borderRadius: "10px",
                        }}
                      >
                        {" "}
                        comment :
                        <span className="text-light   ms-2">
                          {comm.comment}
                        </span>{" "}
                      </span>
                    ) : (
                      <span></span>
                    )
                  )}
                </div>
              </div>
              {/* collapsed content */}
            </div>
          ))
        ) : (
          <h4 className="text-align-center text-center ">
            No blogs posted yet!
          </h4>
        )}
      </div>
    </div>
  );
};

export default View;
