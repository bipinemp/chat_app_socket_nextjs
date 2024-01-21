// socket.js
import io from "socket.io-client";

// const socket = io("wss://chatapp-xsy3.onrender.com/");
const socket = io("ws://localhost:8000");

export default socket;
