import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const counter = new client.Counter({
  name: "http_request_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export function requestCountMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    counter.inc({
      method: req.method,
      route: req.originalUrl,
      status_code: res.statusCode,
    });
  });

  next();
}
