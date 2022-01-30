import CourseService from "../../services/course.service";

export class Controller {
  async fetchAllCourses(req, res, next) {
    try {
      const reponse = await CourseService.fetchAllCourses();
      res.status(200).json({ courses: reponse });
    } catch (error) {
      next(error);
    }
  }

  async fetchCourseByName(req, res, next) {
    try {
      const reponse = await CourseService.fetchCourseByName(req.params.course);
      res.status(200).json(reponse);
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      const { courseName, capacity } = req.body;
      if (!courseName || !capacity) {
        throw {
          status: 402,
          message: "Provide courseName and capacity in request body",
        };
      }
      const reponse = await CourseService.addCourse(courseName, capacity);
      res.status(200).json(reponse);
    } catch (error) {
      next(error);
    }
  }

  async bookSlot(req, res, next) {
    try {
      const { userName } = req.body;
      if (!userName) {
        throw { status: 402, message: "Provide userName in request body" };
      }
      const reponse = await CourseService.bookSlot(req.params.course, userName);
      res.status(200).json(reponse);
    } catch (error) {
      next(error);
    }
  }

  async cancelSlot(req, res, next) {
    try {
      const { userName } = req.body;
      if (!userName) {
        throw { status: 402, message: "Provide userName in request body" };
      }
      const reponse = await CourseService.cancelSlot(
        req.params.course,
        userName
      );
      res.status(200).json(reponse);
    } catch (error) {
      next(error);
    }
  }
}

export default new Controller();
