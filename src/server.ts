import express, { Response } from "express";
import { AddressInfo } from "net";
import path from "path";
import WebSocket from "ws";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get("/send", function (_, res: Response) {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

const listener = app.listen(() => console.log("listening"));

const { port } = listener.address() as AddressInfo;
console.log(typeof port, port);

function onConnection(socket: WebSocket) {
  socket.on("message", (text: string) => socket.send(text));
}

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", onConnection);
