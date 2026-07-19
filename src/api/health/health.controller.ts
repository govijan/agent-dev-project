import type http from "node:http";
import { getHealthStatus } from "../../service/health/getHealthStatus.js";

export const healthController = (
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void => {
  const result = getHealthStatus();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
};
