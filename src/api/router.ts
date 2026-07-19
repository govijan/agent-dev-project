import type http from "node:http";
import { healthController } from "./health/health.controller.js";

type RouteHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

type Route = {
  method: string;
  path: string;
  handler: RouteHandler;
};

const routes: Route[] = [
  { method: "GET", path: "/health", handler: healthController },
];

const notFound: RouteHandler = (_req, res) => {
  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "not_found" }));
};

export const dispatch: RouteHandler = (req, res) => {
  const { pathname } = new URL(req.url ?? "", "http://localhost");
  const method = req.method ?? "GET";

  const route = routes.find((r) => r.method === method && r.path === pathname);

  if (!route) {
    notFound(req, res);
    return;
  }

  route.handler(req, res);
};
