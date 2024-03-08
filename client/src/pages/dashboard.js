import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import axios from "axios";
import { franc } from "franc";
import { io } from "socket.io-client";
const socket = io.connect("http://localhost:3002");
// import InputEmoji from 'react-input-emoji'
const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [answer, setAnswer] = useState("");
  // const [newMessage , setNewMessage] = useState('')
  const userInfos = localStorage.getItem("user");

  const [display, setDisplay] = useState(false);
  const [saveImage, setSaveImage] = useState([]);
  const [deleted, setDeleted] = useState(true);
  const [updated, setUpdated] = useState(true);
  const [uploaded, setUploaded] = useState(true);
  const [preview, setPreview] = useState("");
  const [loader, setLoader] = useState(false);
  const [classlist, setClasslist] = useState("image-preview avatar");
  const navigate = useNavigate();
  const [infos, setInfos] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    isloging: "",
  });

  // change document title

  useEffect(() => {
    // Set the initial tab title when the component mounts
    document.title = "Dashboard";
  });

  useEffect(() => {
    if (userInfos) {
      const neew = JSON.parse(userInfos);
      if (neew.isloging === false) {
        navigate("/admin/login");
      } else {
        setInfos({
          id: neew.id,
          firstname: neew.firstname,
          lastname: neew.lastname,
          email: neew.email,
          isloging: true,
        });
        navigate("/dashboard");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate, userInfos]);

  const handleLogout = async (e) => {
    e.preventDefault();
    const id = e.target.id;
    const isLogout = {
      id: infos.id,
      firstname: infos.firstname,
      lastname: infos.lastname,
      email: infos.email,
      isloging: false,
    };

    localStorage.setItem("user", JSON.stringify(isLogout));
    navigate("/admin/login");

    await axios
      .post(`http://localhost:3002/update-status/${id}`)
      .then((data) => console.log(data));
  };

  //  get articles

  useEffect(() => {
    setLoader(true);
    setDeleted(false);
    setUpdated(false);
    fetch("http://localhost:3002/articles")
      .then((res) => res.json())
      .then((data) => {
        setLoader(false);
        setArticles(data.articles);
      });
  }, [updated, deleted]);

  const handleDelete = async (e) => {
    e.preventDefault();
    const articlesID = {
      id: e.target.id,
    };
    console.log(articlesID);
    await axios.post("http://localhost:3002/delete", articlesID).then((res) => {
      setDeleted(true);
      setAnswer(res.data.message);
      console.log(res.data.message);
    });
  };

  const showUpdateBox = (e) => {
    e.preventDefault();
    const theme = e.target.parentElement.parentElement.children[0];

    theme.classList.add("active");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const theme = e.target.parentElement;
    const updatedTitle = e.target.updatedTitle.value;
    const updatedBody = e.target.updatedBody.value;
    setUpdated(true);
    const updated = {
      id: e.target.id,
      title: updatedTitle,
      body: updatedBody,
    };

    theme.classList.remove("active");
    await axios.post("http://localhost:3002/update", updated).then((res) => {
      setAnswer(res.data.message);
      e.target.reset();
    });
  };

  const handleHidden = (e) => {
    const theme = e.target.parentElement.parentElement.parentElement;
    theme.classList.remove("active");
  };

  const [img, setImg] = useState();

  const handleImage = async (e) => {
    e.preventDefault();
    setDisplay(false);
    setClasslist("image-preview avatar active");
    const formData = new FormData();
    formData.append("image", img);
    const neew = JSON.parse(userInfos);
    const ID = neew.id;
    console.log(" user id : " + ID);
    try {
      await axios
        .post(`http://localhost:3002/upload/${ID}`, formData)
        .then((res) => res.json())
        .then((data) => {
          setUploaded(true);
          console.log(data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const savaState = (e) => {
    setImg(e.target.files[0]);
    const src = URL.createObjectURL(e.target.files[0]);
    const prev = e.target.parentElement.children[0];
    prev.classList = "";
    setPreview(src);
    setClasslist("image-preview avatar active");
    setDisplay(true);
  };

  const filInput = (e) => {
    const label = e.target.parentElement.children[1].getAttribute("data-value");
    e.target.value = label;
  };

  // Get profile image from db :

  useEffect(() => {
    if (userInfos) {
      const neew = JSON.parse(userInfos);
      const ID = neew.id;
      const getImage = async () => {
        await fetch(`http://localhost:3002/get-image/${ID}`)
          .then((res) => res.json())
          .then((data) => {
            setUploaded(false);
            setSaveImage(data.data);
            console.log(data.data);
          });
      };
      getImage();
    }
  }, [uploaded]);

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
    <div
      className={
        document.body.style.backgroundColor === "black"
          ? "m-3 p-2 mt-3 card bg-transparent"
          : "m-3 p-2 mt-3 bg-transparent card "
      }
    >
      {answer !== "" ? (
        <div className="alert alert-success text-center">{answer}</div>
      ) : (
        ""
      )}
      <div className="card-header bg-transparent text-center text-primary fs-4 d-flex flex-row justify-content-between align-items-center">
        <form
          action="http://localhost:3002/upload"
          encType="multipart/form-data"
          className="image-form"
          onSubmit={handleImage}
        >
          <img
            src={preview !== "" ? preview : ""}
            alt="preview"
            className={classlist}
          />
          <label htmlFor="imgInput" className="pe-none">
            <span className="avatar"> {infos.firstname[0]} </span>
          </label>
          <input
            type="file"
            className="d-none"
            name="image"
            id="imgInput"
            onChange={savaState}
          />
          <button
            type="submit"
            className={
              display
                ? "btn btn-transaprent image-btn text-success active"
                : "btn btn-transaprent image-btn"
            }
            id="btn"
          >
            save
          </button>
        </form>
        <div className=" fw-bold d-none d-lg-flex d-md-flex">
          <span className="text-warning  shadow-1 p-1">
            <i class="fas fa-spa text-success me-1"></i>
            {infos.firstname} <span className="text-light">'s Dashboard</span>
            <i class="fas fa-spa text-success ms-1"></i>
          </span>
        </div>
        <form id={infos.id} onSubmit={handleLogout}>
          <button
            className="btn btn-danger ms-3"
            data-mdb-tooltip-init
            title="Logout"
          >
            <i class="fas fa-right-from-bracket text-light fs-6"></i>
          </button>
        </form>
      </div>
      <div
        className="card-body p-0"
        style={{ maxHeight: "60vh", overflowY: "scroll" }}
      >
        <h4 className="text-warning">
          View all articles ({articles.length}) :
        </h4>{" "}
        <hr />
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
              className="card p-0 theme-parent text-center h-25 m-auto mb-4 article-card"
              key={art._id}
            >
              <div
                className={
                  document.body.style.backgroundColor === "black"
                    ? "theme back-dark"
                    : "theme bg-light "
                }
              >
                <form
                  className="d-flex flex-column p-2"
                  id={art._id}
                  onSubmit={handleUpdate}
                >
                  <div className="form-floating mb-4">
                    <input
                      type="text"
                      className="form-control bg-transparent border text-info"
                      id="updatedTitle"
                      onClick={filInput}
                      placeholder=""
                      required
                    />

                    <label htmlFor="" className="label" data-value={art.title}>
                      Article-title
                    </label>
                  </div>
                  <div className="form-floating mb-3">
                    <textarea
                      type="text"
                      className="form-control bg-transparent border text-info"
                      id="updatedBody"
                      onClick={filInput}
                      placeholder=""
                      required
                    ></textarea>
                    <label htmlFor="" className="label" data-value={art.body}>
                      Article-body
                    </label>
                  </div>
                  <div className="d-felx flex-row justify-content-center  align-items-center">
                    <button className="btn btn-success mb-3 me-2" type="submit">
                      Confirme
                    </button>
                    <button
                      className="btn btn-danger mb-3 me-2"
                      type="button"
                      onClick={handleHidden}
                    >
                      cancel
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-header text-info fs-4 fw-bold">
                {art.title}
              </div>
              <div
                className="card-body text-light paragraphe"
                style={{ filter: "blur(2)" }}
              >
                {art.body}
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-danger me-3 mb-2"
                  type="submit"
                  id={art._id}
                  onClick={handleDelete}
                >
                  delete
                </button>
                <button
                  className="btn btn-success mb-2 me-3"
                  type="button"
                  onClick={showUpdateBox}
                >
                  update
                </button>
              </div>
            </div>
          ))
        ) : (
          <h3 className="text-center">No posts yet !</h3>
        )}
      </div>
      <div className="card-footer d-flex flex-row justify-content-center mt-3 align-items-center">
        <h5 className="text-warning me-2 text-decoration-underline">
          Contact:
        </h5>
        <a href="mailto:tlailia757@gmail.com">
          <i className="fas fa-envelope text-danger me-4 fs-4 social"></i>
        </a>
        <a href="https://www.facebook.com/?locale=fr_FR" target="blank">
          <i className="fab fa-facebook-square text-primary me-4 fs-4 social"></i>
        </a>
        <a href="https://twitter.com/?lang=fr" target="blank">
          <i className="fab fa-twitter-square text-info fs-4 social"></i>
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
