import { Request, Response, NextFunction } from "express";
import { guage } from "./requestGuage";
import { counter } from "./requestCounter";
import { histogram } from "./requestHistoram";

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  guage.inc();

  res.on("finish", () => {
    const endTime = Date.now();

    counter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });

    histogram.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        status_code: res.statusCode,
      },
      endTime - startTime
    );

    guage.dec();
  });
  next();
}
