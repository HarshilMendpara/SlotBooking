import express from "express";
import controller from "./controller";

export default express
  .Router()
  .get("/", controller.fetchAllCourses)
  .get("/:course", controller.fetchCourseByName)
  .post("/addCourse", controller.createCourse)
  .put("/book/:course", controller.bookSlot)
  .put("/cancel/:course", controller.cancelSlot);
