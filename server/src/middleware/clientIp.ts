import express from "express";

export function clientIpMiddleware(
  req: express.Request,
  _res: express.Response,
  next: express.NextFunction,
): void {
  const xForwardedFor = req.headers["x-forwarded-for"]; // string | string[] | undefined
  let clientIp = null;
  if (Array.isArray(xForwardedFor)) {
    clientIp = xForwardedFor[0];
  } else if (typeof xForwardedFor === "string" && xForwardedFor.length > 0) {
    clientIp = xForwardedFor.split(",")[0].trim();
  } else {
    clientIp = req.ip || (req.socket?.remoteAddress ?? "");
  }

  req.clientIp = clientIp;
  next();
}
