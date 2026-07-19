import http from "node:http";
import { dispatch } from "./api/router.js";

const port = Number(process.env.PORT ?? 3000);

const server = http.createServer(dispatch);

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error);
  process.exit(1);
});
