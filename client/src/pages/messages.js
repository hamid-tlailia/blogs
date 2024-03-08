import React, { useEffect, useRef, useState } from "react";
import logo from "../components/images/man-avatar.avif";
import "../App.css";
import axios from "axios";
import { format } from "timeago.js";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";

const Messages = () => {
  const [user, setUser] = useState(true);
  const [userInfos, setUserInfos] = useState([]);
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  const [userStatus, setUserStatus] = useState(false);
  const [userIMG, setUsersIMG] = useState([]);
  const [isNotSelected, setIsNotSelected] = useState(true);
  const [selected, setSelected] = useState("d-flex start mt-2 p-3");
  const [menu, setMenu] = useState("menu");
  const [notifications, setNotifications] = useState("notifications-menu");
  const storage = localStorage.getItem("user");
  const [brightness, setBrightness] = useState("");
  const [getBrightness, setGetBrightness] = useState("");
  const [isMode, setIsMode] = useState("");
  const [isSetting, setIsSetting] = useState(false);
  const [loader, setLoader] = useState(false);
  const [counter, setCounter] = useState([]);
  const [notifStyle, setNotifStyle] = useState(
    "text-info p-2 rounded-2 m-2 shadow-1 "
  );
  const [isStyled, setIsStyled] = useState(false);

  const counter_infos = useRef();
  const notifs_counter = useRef();
  // get counter
  useEffect(() => {
    const get_counter = async () => {
      try {
        const res = await fetch(`blogs-api-omega.vercel.app/get-messages`);
        const data = await res.json();
        setCounter(data.counter);
      } catch (error) {
        throw error;
      }
    };
    get_counter();
  });

  useEffect(() => {
    setLoader(true);
    if (storage) {
      const getName = JSON.parse(storage);
      const userID = getName.id;
      setUser(false);
      const getUsers = async () => {
        await fetch(`blogs-api-omega.vercel.app/users/${userID}`)
          .then((res) => res.json())
          .then((data) => {
            setLoader(false);
            setUsersIMG(data.image);
            setUserInfos(data.infos);
          });
      };
      getUsers();
    }
  }, [storage]);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (storage) {
      const getName = JSON.parse(storage);
      const userStatus = getName.isloging;
      if (!userStatus) {
        navigate("/admin/login");
      }
    }
  });
  useEffect(() => {
    const getUser = localStorage.getItem("user");
    if (getUser) {
      const getName = JSON.parse(getUser);
      setUserName(getName.firstname);
      setUserID(getName.id);
      if (getName.id === id) {
        setUserStatus(true);
      }
    }
    localStorage.setItem("selected_id", id);
  });

  // change document title

  useEffect(() => {
    // Set the initial tab title when the component mounts
    document.title = "Messages";
  });
  const handleMessage = async (e) => {
    const getName = JSON.parse(storage);
    setIsNotSelected(false);
    const receiverID = e.target.getAttribute("data-receiver");
    const senderID = getName.id;
    setSelected("d-none start");
    const messageInfos = {
      sender: senderID,
      receiver: receiverID,
    };
    setNotifications("notifications-menu");
    const infos = JSON.stringify(messageInfos);
    localStorage.setItem("message", infos);
    // message area scroll auto control

    localStorage.setItem("scroll", true);
  };
  window.onload = () => {
    setSelected("d-none start");
  };

  const handleHide = () => {
    setMenu("menu");
  };
  const handleShow = () => {
    setMenu("menu active");
  };

  // Dark lite mode :
  const hover_dark = useRef();
  const hover_trans = useRef();

  const first = useRef();
  const second = useRef();
  const third = useRef();
  const fourth = useRef();
  const def = useRef();

  const area = useRef();
  const handleDarkMode = (e) => {
    const mode = "black";
    document.body.classList = "default";
    document.body.style.transition = ".5s";
    document.body.style.backgroundColor = "black";
    localStorage.setItem("mode", mode);
  };

  const handleLightMode = (e) => {
    const mode2 = "transparent";
    localStorage.setItem("mode", mode2);
    document.body.style.backgroundColor = "#012a4a";
  };

  useEffect(() => {
    const brihgt = localStorage.getItem("brightness");
    if (brihgt) {
      setGetBrightness(brihgt);
    }
    document.body.style.filter = `saturate(${brihgt})`;
  }, [brightness]);

  useEffect(() => {
    const hover_dark_theme = document.getElementById("hover_dark");
    const hover_trans_theme = document.getElementById("hover_trans");

    const modeLocal = localStorage.getItem("mode");
    if (modeLocal) {
      setIsMode(modeLocal);
    }

    if (isMode === "black") {
      hover_dark_theme.classList.add("active");
      hover_trans_theme.classList.remove("active");
      // document.body.classList = 'default'
      document.body.style.transition = ".5s";
      document.body.style.backgroundColor = "black";
    } else if (isMode === "transparent") {
      const back = localStorage.getItem("background");
      const current_background = document.querySelector(`.${back}`);
      hover_trans_theme.classList.add("active");
      hover_dark_theme.classList.remove("active");
      // document.body.style.backgroundColor = '#012a4a'
      current_background.click();
    }
  }, [isMode]);

  // Background

  const handleBackground = (e) => {
    const current = e.target.classList[0];
    localStorage.setItem("background", current);
    e.target.children[0].classList.add("active");
    if (isMode !== "black") {
      document.body.classList = current;
    }
  };

  useEffect(() => {
    const element = area.current;
    const empty_users = document.getElementById("empty-users");
    if (element.childElementCount === 1) {
      empty_users.classList = "d-flex mt-5 p-lg-3";
    } else {
      empty_users.classList = "d-none";
    }
  }, []);

  setInterval(() => {
    const modeLocal = localStorage.getItem("mode");
    if (modeLocal) {
      setIsMode(modeLocal);
    }

    const back = localStorage.getItem("background");
    const backs = document.querySelectorAll(".backs");

    backs.forEach((bg) => {
      const current_class = bg.classList[0];

      if (current_class === back) {
        bg.children[0].classList.add("active");
        bg.disabled = true;
      } else {
        bg.children[0].classList.remove("active");
        bg.disabled = false;
      }
    });
  }, 100);

  setInterval(() => {
    const element = area.current;
    if (element) {
      const empty_users = document.getElementById("empty-users");
      if (element.childElementCount === 1) {
        empty_users.classList = "d-flex mt-5 p-lg-3";
      } else {
        empty_users.classList = "d-none";
      }
    }
  }, 10);
  window.onmouseover = (e) => {
    const element = area.current;
    if (element) {
      if (element.contains(e.target)) {
        setIsSetting(false);
      } else {
        setIsSetting(false);
      }
    }
  };

  // show notifications function

  const hideNotifications = (e) => {
    setNotifications("notifications-menu");
    setIsStyled(true);
  };

  // get notifications style from localStorge

  // display//hidden notifs none
  const no_notifs = useRef();

  useEffect(() => {
    const no_not = no_notifs.current;
    const not_counter = notifs_counter.current;
    if (not_counter.childElementCount === 0) no_not.classList.add("active");
    else no_not.classList.remove("active");
  });

  // delete notifications request

  const deleteNotifications = async () => {
    const res = await axios.post(
      `http://localhost:3002/delete-notifs/${userID}`
    );
    console.log(res.data.message);
  };

  // get the selected notification user

  const getSelectedUserChat = (e) => {
    const notif_id = e.target.id;
    const users = document.querySelectorAll("#users");
    if (users) {
      users.forEach((user) => {
        const user_receiver_id = user.getAttribute("data-receiver");

        if (user_receiver_id === notif_id) {
          user.click();
          setNotifications("notifications-menu");
        }
      });
    }
  };

  // try  to display real time notifications with a toast

  useEffect(() => {
    counter.map((count_element) =>
      localStorage.setItem("message-element", count_element.lastMessage)
    );
  });

  // hide blocked names

  useEffect(() => {
    const names = document.querySelectorAll("#names");

    if (names) {
      names.forEach((n) => {
        if (n.innerHTML === "") {
          n.innerHTML = "blog-user";
          n.parentElement.children[3].children[0].classList.add("pe-none");
        }
      });
    }
  });

  return (
    <div
      className={
        isMode === "black"
          ? "m-3 p-2 mt-3 card box bg-transparent"
          : "m-3 p-2 mt-3 bg-transparent card box"
      }
    >
      <div className="card-header d-flex  flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row justify-content-center align-items-center mb-1">
          <span className="me-3 avatar text-primary"> {userName[0]} </span>
          <span className="text-light d-flex flex-column flex-lg-row flex-md-row justify-content-center align-items-center  shadow-1 p-1">
            <i class="fas fa-spa text-danger me-1"></i>
            {userName}
            <i class="fas fa-spa text-danger ms-1"></i>
          </span>
        </div>
        <div className="icons d-flex flex-row">
          <i
            class="fas fa-bell text-warning me-3 notifications-button"
            onClick={() => {
              setNotifications("notifications-menu active");
            }}
          >
            {" "}
            <span>
              {notifs_counter.current &&
                (notifs_counter.current.childElementCount === 0 ? (
                  ""
                ) : (
                  <div className="bg-danger text-light notif-badge">
                    {" "}
                    {notifs_counter.current.childElementCount}{" "}
                  </div>
                ))}
            </span>
          </i>
          <i class="fas fa-gear text-warning settings" onClick={handleShow}></i>
          {/* notifications */}
          <div
            className={
              document.body.style.backgroundColor === "black"
                ? `bg-black ${notifications}`
                : notifications
            }
          >
            <div className="notifs-card">
              <div className="card-header d-flex flex-row justify-content-between">
                <span className="fs-4">
                  <i class="fas fa-bell text-warning fs-4 me-2"></i>{" "}
                  Notifications
                </span>
                <span className="hide shadow-1 p-1" onClick={hideNotifications}>
                  X
                </span>
              </div>
              <div
                className="card-body d-flex flex-column-reverse"
                ref={notifs_counter}
              >
                {counter.length !== 0 ? (
                  counter.map((count) =>
                    count.receiverID === userID ? (
                      <div
                        className={
                          document.body.style.backgroundColor === "black"
                            ? `bg-notif bg-black border ${notifStyle}`
                            : `bg-notif ${notifStyle}`
                        }
                      >
                        <div className="notifs-area flex-column flex-lg-row flex-md-row">
                          <span
                            className="text-danger text-decoration-underline"
                            id="names"
                          >
                            {userInfos.map(
                              (user) =>
                                user._id === count.senderID && user.firstname
                            )}
                          </span>
                          <span
                            className={
                              document.body.style.backgroundColor === "black"
                                ? `ms-2 me-2 last-message text-light`
                                : `ms-2 me-2 last-message text-dark`
                            }
                          >
                            : {count.lastMessage}
                          </span>
                          <mark className="text-success ms-2 fs-6">
                            {format(count.updatedAt)}
                          </mark>
                          <span role="button" className=" text-info ms-3">
                            {" "}
                            <i
                              class="fas fa-reply"
                              type="button"
                              data-mdb-ripple-init
                              data-mdb-tooltip-init
                              data-mdb-placement="top"
                              title="Replay to message"
                              id={count.senderID}
                              onClick={getSelectedUserChat}
                            ></i>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )
                  )
                ) : (
                  <React.Fragment>Please wait...</React.Fragment>
                )}
              </div>
              <div className="container">
                <div className="alert alert-dark indicator" ref={no_notifs}>
                  No new notifications !
                </div>
                {notifs_counter.current &&
                  (notifs_counter.current.childElementCount !== 0 ? (
                    <div className="d-flex flex-row justify-content-end border-top align-itmes-center">
                      <button
                        className="btn btn-outline-gold mt-3"
                        id={id}
                        onClick={deleteNotifications}
                      >
                        delete all
                      </button>
                    </div>
                  ) : (
                    <React.Fragment></React.Fragment>
                  ))}
              </div>
            </div>
          </div>
          <div
            className={
              isMode === "black" ? `${menu} bg-black` : `${menu}  card bg-white`
            }
          >
            <div
              className={
                document.body.style.backgroundColor === "black"
                  ? "card bg-black h-100"
                  : "card bg-white shadow-0"
              }
            >
              <div className="card-header d-flex flex-row justify-content-between">
                <span className="fs-4">
                  <i class="fas fa-gear text-primary fs-4 me-2"></i> Settings
                </span>
                <span className="hide shadow-1 p-1" onClick={handleHide}>
                  X
                </span>
              </div>
              <div className="card-body">
                <p>Display mode : </p>
                {/* Mode settings */}
                <div className="d-flex flex-row gap-2">
                  <button
                    className="btn btn-light text-dark trans-btn fw-bold d-flex flex-column gap-2 justify-content-center align-items-center"
                    onClick={handleLightMode}
                    data-mode="transparent"
                  >
                    <div
                      className="hover-trans"
                      ref={hover_trans}
                      id="hover_trans"
                    >
                      <i class="fas fa-check"></i>
                    </div>
                    <i class="far fa-sun text-warning fs-3"></i>
                    <span>Light Mode</span>
                  </button>
                  <button
                    className="btn btn-light text-dark dark-btn fw-bold d-flex flex-column gap-2 justify-content-center align-items-center"
                    onClick={handleDarkMode}
                    data-mode="black"
                  >
                    <div
                      className="hover-dark"
                      ref={hover_dark}
                      id="hover_dark"
                    >
                      <i class="fas fa-check"></i>
                    </div>
                    <i class="far fa-moon text-dark fs-3"></i>
                    <span>Dark Mode</span>
                  </button>
                </div>{" "}
                <hr />
                {/* brightness and contrast settings */}
                <p>Brightness Controls :</p>
                <div className="d-flex flex-row gap-2 w-50 justify-content-center align-items-center">
                  <span> {getBrightness}%</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={getBrightness}
                    class="form-range"
                    id="customRange1"
                    onChange={(e) => {
                      localStorage.setItem("brightness", e.target.value);
                      setBrightness(e.target.value);
                    }}
                  />
                  <span>5%</span>
                </div>{" "}
                <hr />
                {/* Body backgrounds */}
                <p>Backgound Controls : </p>
                <div className="row gap-3 mb-2">
                  <div
                    className="default backs border d-flex justify-content-center align-items-center border-dark"
                    onClick={handleBackground}
                  >
                    <div className="hovers" ref={def}>
                      <i class="fas fa-check"></i>
                    </div>
                    <a href="#!" className="text-decoration-underline pe-none">
                      Deafult
                    </a>
                  </div>
                  <div
                    className="first-back backs"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right top,  #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4,#69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1);",
                    }}
                    onClick={handleBackground}
                  >
                    <div className="hovers" ref={first}>
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                  <div className="second-back backs" onClick={handleBackground}>
                    <div className="hovers" ref={second}>
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                  <div className="third-back backs" onClick={handleBackground}>
                    <div className="hovers" ref={third}>
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                  <div className="fourth-back backs" onClick={handleBackground}>
                    <div className="hovers" ref={fourth}>
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                  <div className="fifth-back backs" onClick={handleBackground}>
                    <div className="hovers">
                      <i class="fas fa-check"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column flex-lg-row flex-md-row p-0">
        <form className="online-users  border w-auto p-3 d-flex flex-row flex-lg-column flex-md-column ">
          {loader ? (
            <div className="user-chat d-flex flex-row justify-content-center text-light align-items-center">
              loading{" "}
              <div class="spinner-border text-light ms-3 " role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            userInfos.map((user) => (
              <NavLink
                onClick={handleMessage}
                className="d-flex flex-row  bg-light card m-2  p-2  user-chat"
                to={`chatBox/${user._id}`}
                data-receiver={user._id}
                role="button"
                id="users"
              >
                {user.firstname}
                <span
                  className={
                    user.status === "online"
                      ? "badge bg-success ms-1"
                      : "badge offline ms-1"
                  }
                >
                  {" "}
                </span>
              </NavLink>
            ))
          )}
        </form>
        <div
          className="chat-box text-light w-100 h-100  p-0 p-lg-0 p-md-0 text-center d-flex flex-row justify-content-center align-items-center"
          ref={area}
          id="element"
        >
          <h4 className="d-none" id="empty-users">
            <i className="fas fa-comment-sms text-warning me-1 mt-1 "></i> Click
            any user to start chat
          </h4>
          {<Outlet />}
        </div>
      </div>
      <div className="card-footer d-flex flex-row justify-content-center align-items-center">
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

export default Messages;
