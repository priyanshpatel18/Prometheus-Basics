import { NextFunction, Request, Response } from "express";
import client from "prom-client";

export const histogram = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000],
});

export function requestHistogramMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  res.on("finish", () => {
    const end = Date.now();

    histogram.observe(
      {
        method: req.method,
        route: req.originalUrl,
        status_code: res.statusCode,
      },
      end - start
    );
  });
  next();
}
