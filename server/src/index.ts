import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
const PORT = process.env.PORT || 8000;

interface ChatMessage {
  senderId: string;
  message: string;
  createdAt: string;
  image?: string;
  username?: string;
}

interface UserData {
  username: string;
  email?: string;
  id?: string;
  image?: string;
}

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

io.on("connection", (socket: Socket) => {
  console.log("A user connected");

  socket.on(
    "joinRoom",
    ({ userData, roomId }: { userData: UserData; roomId: string }) => {
      if (userData?.username) {
        socket.join(roomId);
        // socket.broadcast.to(roomId).emit("chatMessage", {
        //   username: "Admin",
        //   message: `${userData?.username} has joined the room.`,
        // });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chatMessage", (message: ChatMessage, roomId: string) => {
    io.to(roomId).emit("chatMessage", message);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
