import express, { NextFunction, Request, Response } from "express";
import client from "prom-client";
import { metricsMiddleware } from "./metrics";

const app = express();

app.use(express.json());
app.use(metricsMiddleware);

app.get("/user", async (req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  res.json({ name: "John Doe" });
});

app.get("/metrics", async (req: Request, res: Response, next: NextFunction) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
