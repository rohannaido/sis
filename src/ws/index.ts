const { createServer } = require("http");
const { WebSocketServer } = require("ws");
const { v4: uuid } = require("uuid");

function authenticate(request: any, callback: any) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const userId = url.searchParams.get("userId");

  console.log("USER ID", userId);

  if (userId) {
    callback(null, true, userId);
  } else {
    callback(null, false);
  }
}

function onSocketError(error: any) {
  console.error("Socket error", error);
}

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

const activeUsers = new Map();
const socketConnections = new Map();

console.log("Listening on port 3001");
wss.on("connection", function connection(ws: any) {
  ws.id = uuid();
  console.log("connected", ws.userId);

  const userSessions = activeUsers.get(ws.userId);
  if (userSessions) {
    userSessions.add(ws.id);
    activeUsers.set(ws.userId, userSessions);
  } else {
    activeUsers.set(ws.userId, new Set([ws.id]));
  }

  // Send a message to all connected clients
  wss.clients.forEach(function each(client: any) {
    if (client.readyState === 1) {
      client.send(
        JSON.stringify({
          type: "USER_ACTIVITY",
          data: {
            userId: ws.userId,
            status: "ONLINE",
          },
        })
      );
    }
  });

  ws.on("message", function message(data: any) {
    console.log("received: %s", data);
    const messageData = JSON.parse(data);
    if (messageData.type === "GET_USER_ACTIVITY_LIST") {
      ws.send(
        JSON.stringify({
          type: "USER_ACTIVITY_LIST",
          data: Array.from(activeUsers.keys())?.map((key: any) => ({
            userId: key,
            status: "ONLINE",
          })),
        })
      );
    }
  });

  ws.on("close", function close() {
    activeUsers.get(ws.userId).delete(ws.id);
    if (activeUsers.get(ws.userId).size === 0) {
      activeUsers.delete(ws.userId);
    }
    wss.clients.forEach(function each(client: any) {
      if (client.readyState === 1) {
        client.send(
          JSON.stringify({
            type: "USER_ACTIVITY",
            data: {
              userId: ws.userId,
              status: "INACTIVE",
            },
          })
        );
      }
    });
    console.log("disconnected");
  });

  ws.on("error", console.error);
});

server.on("upgrade", function upgrade(request: any, socket: any, head: any) {
  socket.on("error", onSocketError);

  authenticate(
    request,
    function next(err: any, client: any, userId: string | null) {
      if (err || !client) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      socket.removeListener("error", onSocketError);

      wss.handleUpgrade(request, socket, head, function done(ws: any) {
        ws.userId = userId;
        wss.emit("connection", ws, request, client);
      });
    }
  );
});

server.listen(3001);
