import { io } from "https://cdn.socket.io/4.8.3/socket.io.esm.min.js";
import { server_url } from "./config.js";

const socket = io(server_url);

socket.on("connect", () => {
  console.log(`Connection established: ${server_url}`);
});

const register_user = (userId) => {
  socket.emit("register_user", userId);
};

export { register_user, socket };
