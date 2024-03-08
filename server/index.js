const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const app = express();
const { Server } = require("socket.io");

app.use(cors());
const http = require("http");

app.use(express.json());

// socket io configurations

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

// To use the body params as a json we must use express.json in app

app.use(express.json());
const { v4: uuidv4 } = require("uuid");

const Article = require("./modals/registerModel");
const Comment = require("./modals/commentMoal");
const Register = require("./modals/registerUser");
const ImageModel = require("./modals/imageModel");
const Message = require("./modals/messageModal");
const multer = require("multer");
const Counter = require("./modals/messages_counter");

app.post("/", async (req, res) => {
  const infos = req.body;
  const articleTitle = infos.title;
  const articleBody = infos.body;

  const saveArticle = new Article();
  saveArticle.title = articleTitle;
  saveArticle.body = articleBody;
  try {
    await saveArticle.save();
    res.json({ message: "Article successfuly created !" });
  } catch (error) {
    res.json({ message: "Article already exists" });
    console.log("Error while adding article : " + error);
  }
});

// Get articles from db :

app.get("/articles", async (req, res) => {
  try {
    const articles = await Article.find().sort({ _id: -1 });
    if (articles) {
      res.json({ articles: articles });
    } else {
      res.json({ message: "error getting articles" });
    }
  } catch (error) {
    res.json({ message: "error getting articles" });
    console.log("error getting articles");
  }
});

// save comments :

app.post("/saveComments", async (req, res) => {
  const comments = req.body;
  const commentID = comments.articleID;
  const commentBody = comments.articleComment;
  const newComment = new Comment();
  newComment.articleID = commentID;
  newComment.comment = commentBody;

  try {
    await newComment.save();
    res.json({ message: "comment published !" });
  } catch (error) {
    res.json({ message: "Error ! try agin !" });
  }
});

// get comments

app.get("/getComments", async (req, res) => {
  try {
    const allComments = await Comment.find();
    res.json(allComments);
  } catch (error) {
    console.log("error getting comments" + error);
  }
});

// save register  infos :

app.post("/register", async (req, res) => {
  const userInfos = req.body;
  const userFirstName = userInfos.firstname;
  const userLastName = userInfos.lastname;
  const userEmail = userInfos.email;
  const userPassword = userInfos.password;

  const newUser = new Register();
  newUser.firstname = userFirstName;
  newUser.lastname = userLastName;
  newUser.email = userEmail;
  newUser.password = userPassword;

  try {
    await newUser.save();
    res.json({ message: "Registred successfuly !" });
    console.log("success");
  } catch (error) {
    res.json({
      message: "User with E-mail : " + userEmail + " already exists !",
    });
    console.log("error" + error);
  }
});

// Login user verificationn :

app.post("/login", async (req, res) => {
  const loginInfos = req.body;
  const loginEmail = loginInfos.email;
  const loginPassword = loginInfos.password;

  try {
    const getUser = await Register.findOne({
      email: loginEmail,
      password: loginPassword,
    });
    if (getUser) {
      await Register.findByIdAndUpdate(getUser._id, {
        $set: { status: "online" },
      });
      const data = {
        firstname: getUser.firstname,
        lastname: getUser.lastname,
        email: getUser.email,
        isLoging: true,
      };
      res.json({ message: "redirect", infos: getUser });
    } else {
      res.json({ message: "Email or password incorrect !" });
    }
  } catch (error) {
    console.log("Error : " + error);
  }
});

// delete article :

app.post("/delete", async (req, res) => {
  const id = req.body.id;

  try {
    const deletArticle = await Article.findByIdAndDelete({ _id: id });
    if (deletArticle) {
      res.json({ message: "Item with ID : " + id + " successfully deleted !" });
    } else {
      res.json({ message: "error " });
    }
  } catch (error) {}
});

// update article :

app.post("/update", async (req, res) => {
  const updateInfos = req.body;
  const id = updateInfos.id;
  try {
    const updateArticle = await Article.findByIdAndUpdate(id, updateInfos, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (updateArticle) {
      res.json({ message: "Article successfully updated" });
    } else {
      res.json({ message: "error " });
    }
  } catch (error) {}
});

// upload profile image to server :
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "../client/src/pages/profile-images");
  },
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image");

app.post("/upload/:id", upload, async (req, res) => {
  const imageName = req.file.filename;
  const userID = req.params.id;
  try {
    const uploadImage = await ImageModel.create({
      name: imageName,
      userID: userID,
    });
    if (uploadImage) {
      res.json({ message: "Images successfully uploaded !" });
    } else {
      res.json({ message: "Error while uploadeding image !" });
    }
  } catch (error) {}
});

// get all users :

app.get("/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const getUser = await Register.find({ _id: { $ne: id } }); // $ne = where not equal
    if (getUser) {
      const getImage = await ImageModel.find({ userID: id })
        .sort({ _id: -1 })
        .limit(1);
      if (getImage) {
        const allData = {
          infos: getUser,
          image: getImage,
        };
        res.json(allData);
      }
    } else {
      res.json({ message: "No user exists " });
    }
  } catch (error) {
    console.log("Error : " + error);
  }
});

// get profile image from db :

app.get("/get-image/:id", async (req, res) => {
  const user_id = req.params.id;

  try {
    const getImage = await ImageModel.find({ userID: user_id })
      .sort({ _id: -1 })
      .limit(1);
    if (getImage) {
      res.json({ data: getImage });
    } else {
      res.json({ message: "Error while getting image !" });
    }
  } catch (error) {}
});

// Get messages
app.get("/messages/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const getUser = await Register.find({ _id: id }); // $ne = where not equal
    if (getUser) {
      const getImage = await ImageModel.find({ userID: id })
        .sort({ _id: -1 })
        .limit(1);
      if (getImage) {
        const getMessages = await Message.find().sort({ _id: 1 });
        if (getMessages) {
          const allData = {
            infos: getUser,
            image: getImage,
            messages: getMessages,
          };
          res.json(allData);
        }
      }
    } else {
      res.json({ message: "No user exists " });
    }
  } catch (error) {
    console.log("Error : " + error);
  }
});

// save messages :
let generale_infos = {
  message: "",
  sender: "",
  receiver: "",
  resend: false,
};
app.post("/save-message", async (req, res) => {
  const messageInfos = req.body;
  const chatID = uuidv4();
  const mesageSenderID = messageInfos.sender;
  const messageReceiverID = messageInfos.receiver;
  const message = messageInfos.message;
  const newMessage = new Message({
    reference: chatID,
    senderID: mesageSenderID,
    receiverID: messageReceiverID,
    message: message,
  });
  // try saving message :
  try {
    const saveMessage = await newMessage.save();
    if (saveMessage) {
      generale_infos = {
        message: message,
        sender: mesageSenderID,
        receiver: messageReceiverID,
        resend: true,
      };
      // try to check if receiver exits in message-counter :
      const check_user = await Counter.findOne({
        receiverID: messageReceiverID,
        senderID: mesageSenderID,
      }).sort({ _id: -1 });
      if (check_user) {
        // update table
        let count = Number(check_user.counter);
        const counter_id = check_user._id;
        const update_user = await Counter.findByIdAndUpdate(counter_id, {
          $set: { counter: count + 1, lastMessage: message },
        });

        if (update_user) {
          res.json({ message: "Message sent successfully !" });
        }
      } else {
        // create new user

        const message_counter = new Counter({
          senderID: mesageSenderID,
          receiverID: messageReceiverID,
          counter: 1,
          style: "fw-bold",
          lastMessage: message,
        });

        const save_counter = await message_counter.save();

        if (save_counter) {
          res.json({ message: "Message sent successfully !" });
        }
      }
    } else {
      res.json({ message: "Error  while sending message " });
    }
  } catch (error) {
    console.log("eroorrrr :  " + error);
  }
});

// resend notifications

app.get("/notifications", (req, res) => {
  generale_infos = {
    message: "",
    sender: "",
    receiver: "",
    resend: false,
  };
  res.json(generale_infos);
});
// get messages :

app.get("/get-messages", async (req, res) => {
  const getMessages = await Message.find().sort({ _id: 1 });
  const infos = req.body;

  if (getMessages) {
    // get messages counter
    const message_counter = await Counter.find();
    if (message_counter) {
      res.json({ messages: getMessages, counter: message_counter });
    }
  } else {
    res.json({ message: "error" });
  }
});

// delete all  messages :

app.delete("/delete", (req, res) => {
  console.log(req.body);
  try {
    Message.deleteMany({}, function (err) {
      if (err) {
        res.status(500).send({ error: "Could not clear database..." });
      } else {
        res
          .status(200)
          .send({ message: "All  infos was deleted successfully..." });
      }
    });
  } catch (error) {
    console.log("eroorrrr :  " + error);
  }
});

// update counter request

app.post("/update-counter", async (req, res) => {
  const sender = req.body.sender;
  const receiver = req.body.receiver;

  const update_counter = await Counter.findOne({
    receiverID: receiver,
    senderID: sender,
  });
  if (update_counter) {
    // update counter
    const counter_id = update_counter._id;

    const update_current_counter = await Counter.findByIdAndUpdate(counter_id, {
      $set: { counter: 0, style: "noraml" },
    });

    if (update_current_counter) {
      res.json("counter successfully updated");
    }
  }
});
// update-status of user :

app.post("/update-status/:id", async (req, res) => {
  const userid = req.params.id;

  const updateStatus = await Register.findByIdAndUpdate(userid, {
    $set: { status: "offline" },
  });
  if (updateStatus) {
    res.json("updated");
  }
});

// delete notifications request

app.post("/delete-notifs/:id", async (req, res) => {
  const receiver_notifs = req.params.id;

  // check if user exists in notifs table
  const delete_notif = await Counter.find();
  if (delete_notif) {
    // get the notifs id
    const notifs_id = delete_notif._id;
    // delte all notifications received by current user
    const delete_all_notifs = await Counter.deleteMany({
      receiverID: receiver_notifs,
    });
    if (delete_all_notifs)
      res.json({ message: "Notifications successfully deleted !" });
  }
});

// delete message

app.post("/delete-message/:id", async (req, res) => {
  const data = req.params.id;
  try {
    // find message by id and delete
    const find_message_and_delete = await Message.findByIdAndDelete(data);
    // check if message deleted

    if (find_message_and_delete) {
      res.send("Message successfully deleted");
    }
  } catch (error) {
    console.log(error);
  }
});
// socket configurations

// array for all connected users

let onlineUsers = [];

// function to check if user is online or add him to online users

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  // add a new user when he connect

  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);

    // send a verification to be sure user exists

    io.emit("check", username);
  });

  // get notifications infos from client

  socket.on("sendNotification", async (data) => {
    const receiver = getUser(data.receiver);

    // check if receiver exists then send notifications

    if (receiver) {
      // get sender  name from data base
      const get_name = await Register.findOne({ _id: data.sender });
      if (get_name) {
        const sender_name = get_name.firstname;

        // send notifications to user
        io.to(receiver.socketId).emit("getNotification", {
          sender: sender_name,
          receiver: data.receiver,
          message: data.message,
        });
      }
    } else {
      io.emit("noUser");
    }
  });

  // remove user from onlineUsers when he disconnect

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

server.listen(3002, (req, res) => {
  console.log("server is running at port 3002 ");
});

// MongoDB connection URL
const mongoURI =
  "mongodb+srv://hamid:tffmn986@cluster0.ix4xpgq.mongodb.net/?retryWrites=true&w=majority";

// Create MongoDB connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

// Check internet connection before connecting to MongoDB
const checkInternetConnection = () => {
  // Perform a simple HTTP request to check internet connectivity
  // You can replace the URL with any publicly accessible endpoint
  require("dns").resolve("www.google.com", (err) => {
    if (err) {
      console.error("No internet connection:", err.message);
    } else {
      // Internet connection exists, connect to MongoDB
      connectToDatabase();
    }
  });
};

// Call the function to check internet connection and connect to MongoDB
checkInternetConnection();
