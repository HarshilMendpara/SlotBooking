import courseRouter from "./api/controllers/course/router";

export default function routes(app) {
  app.use("/api/v1/courses", courseRouter);
}
