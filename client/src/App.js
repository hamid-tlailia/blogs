import "./App.css";
import Header from "./components/header";
import Admin from "./pages/admin";
import Client from "./pages/client";
import Home from "./pages/home";
import ErrorBoundary from "./pages/error";
import { ToastContainer, toast } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Create from "./subComponent/create";
import View from "./subComponent/view";
import Login from "./subComponent/login";
import Register from "./subComponent/register";
import Dashboard from "./pages/dashboard";
import Messages from "./pages/messages";
import ChatBox from "./subComponent/chatBox";
import Connectivity from "./pages/connectivity";
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [user, setUser] = useState("");
  const [isLoged, setisLoged] = useState(false);

  useEffect(() => {
    const getUser = localStorage.getItem("user");
    if (getUser) {
      const user_get_name = JSON.parse(getUser);
      const status = user_get_name.isloging;
      const user_namme = user_get_name.firstname;

      if (status === true) {
        setUser(user_namme);
        setisLoged(true);
      }
    }

    socket.on("noUser", () => {
      console.log("no user is online");
    });
  });

  useEffect(() => {
    if (user !== "") {
      socket?.emit("newUser", user);
      setisLoged(false);
    }
  }, [isLoged]);

  socket.on("check", (data) => {
    console.log("username received from socket server is : " + data);
  });

  useEffect(() => {
    socket.on("getNotification", (data) => {
      // check if receiver is online

      const getUser = localStorage.getItem("user");
      const user_get_name = JSON.parse(getUser);
      const status = user_get_name.isloging;
      const user_namme = user_get_name.firstname;
      const receiver_name = data.receiver;
      if (status === true && user_namme === receiver_name) {
        if ("Notification" in window) {
          // Check if the browser supports notifications
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // If permission is granted, show the notification
              new Notification(`${data.sender} : ${data.message}`);
            }
          });
        }

        // toast.success("new message coming")
      } else {
        if ("Notification" in window) {
          // Check if the browser supports notifications
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              // If permission is granted, show the notification
              new Notification(`${receiver_name} have a new message`);
            }
          });
        }
      }
    });
  }, []);

  return (
    <>
      {isOnline ? (
        <Router>
          <div className="App bg-transparent">
            <Header />

            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/client" element={<Client />}>
                <Route path="create" element={<Create />} />
                <Route path="view" element={<View />} />
              </Route>

              <Route path="/admin" element={<Admin />}>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/:any" element={<Home />} />

              <Route path="/messages/:id" element={<Messages />}>
                <Route path="chatBox/:id" element={<ChatBox />} />
              </Route>
              <Route path="/connectivity" element={<Connectivity />} />
            </Routes>
          </div>
        </Router>
      ) : (
        <Connectivity />
      )}
    </>
  );
}

export default App;

// Finished today 09/02/2024 at 23:16 PM
