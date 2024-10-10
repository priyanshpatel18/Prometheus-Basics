import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const guage = new client.Gauge({
  name: "active_requests",
  help: "Total number of active requests",
  labelNames: ["method", "route", "status_code"],
});

export function requestGuageMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  guage.inc({
    method: req.method,
    route: req.originalUrl,
    status_code: res.statusCode,
  });

  res.on("finish", () => {
    guage.dec({
      method: req.method,
      route: req.originalUrl,
      status_code: res.statusCode,
    });
  });
  
  next();
}
