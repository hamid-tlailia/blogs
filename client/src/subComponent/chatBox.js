import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import insect from "../pages/images/insect.png";
import "../App.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { socket } from "../socket/socket";

const ChatBox = () => {
  const [userIMG, setUsersIMG] = useState([]);
  const [data, setData] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [isSent, setIsSend] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const userInfos = localStorage.getItem("user");
  const [saveImage, setSaveImage] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [counter, setCounter] = useState([]);
  const [duplicated, setDuplicated] = useState([]);
  // Create a set to store unique values
  const uniqueSet = new Set();

  const userID = useParams();
  const chat = useRef();
  useEffect(() => {
    setLoader(true);
    const getMessages = async () => {
      const res = await fetch(`http://localhost:3002/messages/${userID.id}`);
      const data = await res.json();
      setLoader(false);
      setData(data.infos);
      setUsersIMG(data.image);
      setUserMessages(data.messages);
    };
    getMessages();
  }, [userID]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // handle scrolloverview messages area
  useEffect(() => {
    const scrolled = chat.current;
    if (scrolled && userID.id) {
      scrolled.scrollTop = scrolled.scrollHeight;
    }
  });

  // send message
  const storage = localStorage.getItem("user");
  const getName = JSON.parse(storage);
  const id = getName.id;

  const messageA = useRef();

  // web socket

  const handleMessage = async (e) => {
    const receiverIS = e.target.id;
    e.preventDefault();
    if (newMessage !== "") {
      const senderID = id;
      const receiverID = e.target.id;
      const message = newMessage;

      const messageInfos = {
        sender: senderID,
        receiver: receiverID,
        message: message,
      };

      try {
        await axios
          .post("http://localhost:3002/save-message", messageInfos)
          .then((res) => res.json)
          .then((data) => {
            setIsSend(true);
            setNewMessage("");
          });
      } catch (error) {
        console.log(error);
      }
      // web socket

      const curent_name = data.find((user) => user._id === receiverIS);
      const receiverName = curent_name.firstname;

      socket.emit("sendNotification", {
        sender: id,
        receiver: receiverName,
        message: newMessage,
      });
    } else {
      alert("Please type a message first !");
    }
  };

  // get messages

  useEffect(() => {
    try {
      fetch(`http://localhost:3002/get-messages`)
        .then((res) => res.json())
        .then((data) => {
          setCounter(data.counter);
          setAllMessages(data.messages);
        });
    } catch (error) {
      throw error;
    }
  }, [allMessages]);

  useEffect(() => {
    const scrolled = chat.current;
    if (scrolled) {
      scrolled.scrollTop = scrolled.scrollHeight;
    }
  }, [allMessages.length]);

  // Get profile image from db :

  useEffect(() => {
    if (userInfos) {
      const neew = JSON.parse(userInfos);
      const ID = neew.id;
      const getImage = async () => {
        await fetch(`http://localhost:3002/get-image/${ID}`)
          .then((res) => res.json())
          .then((data) => {
            setSaveImage(data.data);
          });
      };
      getImage();
    }
  }, [userInfos]);

  // copy btn func
  let windoTraget = "";

  window.onclick = function (e) {
    let editables = document.querySelectorAll("#editable");

    if (editables) {
      editables.forEach((edit) => {
        if (e.target === edit) {
          edit.parentElement.children[0].classList.add("active");
          edit.classList.add("copiedStyle");
        } else {
          edit.parentElement.children[0].classList.remove("active");
          edit.classList.remove("copiedStyle");
        }
      });
    }
  };

  // copy btn finction

  const copy = (e) => {
    const copied_text =
      e.target.parentElement.parentElement.children[1].innerText;
    // Access the clipboard and write the text directly
    navigator.clipboard
      .writeText(copied_text)
      .then(() => {
        toast.success("Text copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // handle delete single message

  const deleteMessage = async (e) => {
    const deleted_message = e.target.parentElement.parentElement.children[1];
    const message_id = e.target.id;
    const res = await axios.post(
      `http://localhost:3002/delete-message/${message_id}`
    );

    if (res) {
      deleted_message.innerHTML = `<div class='d-flex flex-row justify-content-center align-items-center'>
   <div class="spinner-border  spinner-border-sm text-warning" role="status">
   <span class="visually-hidden">Loading...</span>
</div>
  </div>`;
      const data = res.data;
      toast.success(data);
    }
  };

  // reply messages function

  const reply = (e) => {
    const replied_message =
      e.target.parentElement.parentElement.children[1].innerText;
    const str = replied_message.indexOf(":");
    console.log(str);
    setNewMessage(`${replied_message}: `);
  };

  return (
    <>
      {loader ? (
        <div className="messages d-flex flex-row justify-content-center align-items-center">
          loading{" "}
          <div class="spinner-border ms-3 " role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : data.lenght !== 0 ? (
        data.map((user) => (
          <div className=" d-flex flex-column-reverse shadow-5 border chat-Box flex-lg-row flex-md-row justify-content-center align-items-center  h-100 w-100">
            <div
              className="messages d-flex flex-column  border justify-content-start align-items-start p-3"
              ref={messageA}
              id="message-area"
            >
              <img src={insect} className="papillon" alt="logo" />
              {/* <img src={insect_second} className="papillon-second" alt="logo" /> */}
              <div className=" bg-transparent chat w-100 h-100 mb-4" ref={chat}>
                {loader ? (
                  <div className="messages d-flex flex-row justify-content-center align-items-center">
                    loading{" "}
                    <div class="spinner-border ms-3 " role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : allMessages.length !== 0 ? (
                  allMessages.map((messageArea) =>
                    (messageArea.senderID === id &&
                      messageArea.receiverID === user._id) ||
                    (messageArea.senderID === user._id &&
                      messageArea.receiverID === id) ? (
                      messageArea.message !== "" ? (
                        messageArea.senderID === id &&
                        messageArea.receiverID === user._id ? (
                          <div className="d-flex flex-row ">
                            <span className="me-3 w-auto symbole">
                              {getName.firstname[0]}
                            </span>
                            <div>
                              <p className=" text-white usermssg  p-1 mb-0">
                                <div className="copy-button-parent">
                                  <span
                                    className="reply"
                                    title="Reply to message"
                                    onClick={reply}
                                  >
                                    <i class="fas fa-reply"></i>
                                  </span>
                                  <span
                                    className="delete"
                                    title="Delete message"
                                    id={messageArea._id}
                                    onClick={deleteMessage}
                                  >
                                    <i class="fas fa-trash-can"></i>
                                  </span>
                                  <span
                                    className="copy-button"
                                    title="Copy message"
                                    onClick={copy}
                                  >
                                    <i class="far fa-clone"></i>
                                  </span>
                                </div>
                                <span
                                  contentEditable="false"
                                  id="editable"
                                  className="editable"
                                  suppressContentEditableWarning="true"
                                >
                                  {messageArea.message.includes(":")
                                    ? messageArea.message.slice(
                                        messageArea.message.indexOf(":") + 1,
                                        messageArea.message.length
                                      )
                                    : messageArea.message}
                                </span>
                              </p>
                              <p className="time w-100 d-flex flex-row justify-content-end align-items-end">
                                {format(messageArea.createdAt)}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-row  justify-content-end align-items-end">
                            <div className="d-flex flex-row">
                              <span className="me-3 symbole ">
                                {" "}
                                {user.firstname[0]}{" "}
                              </span>
                              <div>
                                <p className="text-dark bg-white user  p-1 mb-0">
                                  <div className="copy-button-parent">
                                    <span
                                      className="reply"
                                      title="Reply to message"
                                      onClick={reply}
                                    >
                                      <i class="fas fa-reply"></i>
                                    </span>
                                    <span
                                      className="delete"
                                      title="Delete message"
                                      id={messageArea._id}
                                      onClick={deleteMessage}
                                    >
                                      <i class="fas fa-trash-can"></i>
                                    </span>
                                    <span
                                      className="copy-button"
                                      title="Copy text"
                                      onClick={copy}
                                    >
                                      <i class="far fa-clone"></i>
                                    </span>
                                  </div>
                                  <span
                                    contentEditable="false"
                                    id="editable"
                                    className="editable"
                                    suppressContentEditableWarning="true"
                                  >
                                    {messageArea.message.includes(":") ? (
                                      <span
                                        contentEditable="false"
                                        suppressContentEditableWarning="true"
                                        className="p-0 pe-none"
                                      >
                                        {" "}
                                        {
                                          <span className="bg-warning rounded-5 ms-0 p-2 text-light">
                                            Replied &nbsp;
                                            <i class="fas fa-circle-right"></i>
                                          </span>
                                        }{" "}
                                        {messageArea.message}{" "}
                                      </span>
                                    ) : (
                                      <span className="ms-2 pe-none">
                                        {" "}
                                        {messageArea.message}{" "}
                                      </span>
                                    )}
                                  </span>
                                </p>

                                <p className="time w-100 d-flex flex-row justify-content-end align-items-end">
                                  {format(messageArea.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      ) : (
                        ""
                      )
                    ) : (
                      ""
                    )
                  )
                ) : (
                  <div className="messages d-flex flex-row justify-content-center align-items-center">
                    loading{" "}
                    <div class="spinner-border ms-3 " role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <div className="h-auto"></div>
              </div>
              <form
                className="message-input w-100  d-flex flex-row flex-lg-row flex-md-row"
                id={user._id}
                onSubmit={handleMessage}
                style={{ background: document.body.style.background }}
              >
                <InputEmoji
                  value={newMessage}
                  onChange={handleChange}
                  id="message"
                />
                <button
                  className="btn btn-primary text-light p-2 h-25 m-auto  text-warning"
                  type="submit"
                  style={{ borderRadius: "30%", padding: "5px" }}
                >
                  {" "}
                  <i class="far fa-paper-plane"></i>{" "}
                </button>
              </form>
            </div>
            <div className=" d-none d-lg-flex bg-transparent  d-md-flex card p-2 w-25 shadow-0 d-flex flex-column ms-2 justify-content-center align-items-center ">
              <span className="me-3 image"> {user.firstname[0]} </span>
              <br />
              <div className="d-flex flex-column justify-content-start align-items-start">
                <span className="text-warning text-start">
                  <span className="text-white">Name </span> : {user.firstname}{" "}
                </span>{" "}
                <hr />
                <span className="text-danger">
                  <span className="text-white">Last-Name </span> :{" "}
                  {user.lastname}{" "}
                </span>{" "}
                <hr />
                <span className="text-success">
                  <span className="text-white">Member since </span> :{" "}
                  {format(user.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <span></span>
      )}
      <ToastContainer />
    </>
  );
};

export default ChatBox;
