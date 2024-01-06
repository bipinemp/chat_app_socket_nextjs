import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
});

app.get("/", (req, res) => res.send("Hello from server"));

interface ChatMessage {
  username: string;
  message: string;
}

io.on("connection", (socket: Socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("send_msg", (data) => {
    console.log("Received message to send:", data);
    // Emit the received message back to the sender
    socket.emit("receive_msg", data);
    // This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
