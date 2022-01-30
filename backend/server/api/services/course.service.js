import { database } from "../../common/firebase";
import l from "../../common/logger";

class CourseService {
  coursesCollectionRef = database.collection("courses");

  async fetchAllCourses() {
    try {
      const courses = await this.coursesCollectionRef.get();
      if (courses.empty) {
        return [];
      }
      return courses.docs.map((course) => ({
        id: course.id,
        ...course.data(),
      }));
    } catch (error) {
      l.error("[COURSE: GET ALL COURSES]", error);
      throw error;
    }
  }

  async fetchCourseByName(courseName) {
    try {
      const courses = await this.coursesCollectionRef
        .where("courseName", "==", courseName)
        .get();
      if (courses.empty) {
        throw { status: 401, message: "Invalid course name" };
      }
      const course = courses.docs[0];
      return {
        id: course.id,
        ...course.data(),
      };
    } catch (error) {
      l.error("[COURSE: GET COURSE BY NAME]", error);
      throw error;
    }
  }

  async addCourse(courseName, capacity) {
    try {
      await this.coursesCollectionRef.add({
        courseName,
        capacity,
        startTime: Date.now() + 1000 * 60 * 60,
        bookedUsers: [],
        waitingList: [],
      });
      return { message: "Course added successfully" };
    } catch (error) {
      l.error("[COURSE: ADD COURSE]", error);
      throw error;
    }
  }

  async bookSlot(courseName, userName) {
    try {
      const course = await this.fetchCourseByName(courseName);
      if (course.bookedUsers.includes(userName)) {
        throw { status: 402, message: "User already booked" };
      }
      if (course.bookedUsers.length < course.capacity) {
        course.bookedUsers.push(userName);
        await this.coursesCollectionRef.doc(course.id).update(course);
        return { message: "Slot booked successfully" };
      } else {
        course.waitingList.push(userName);
        await this.coursesCollectionRef.doc(course.id).update(course);
        return { message: "User added in waiting list" };
      }
    } catch (error) {
      l.error("[COURSE: BOOK SLOT]", error);
      throw error;
    }
  }

  async cancelSlot(courseName, userName) {
    try {
      const course = await this.fetchCourseByName(courseName);
      if (!course.bookedUsers.includes(userName)) {
        throw { status: 402, message: "User not booked" };
      }
      if (course.startTime - Date.now() < 1000 * 60 * 30) {
        throw {
          status: 403,
          message: "Cannot cancel slot in less than 30 mins",
        };
      }
      course.bookedUsers = course.bookedUsers.filter(
        (bookedUser) => bookedUser !== userName
      );
      if (course.waitingList.length) {
        course.bookedUsers.push(course.waitingList.shift());
      }
      await this.coursesCollectionRef.doc(course.id).update(course);
      return { message: "Slot cancelled successfully" };
    } catch (error) {
      l.error("[COURSE: CANCEL SLOT]", error);
      throw error;
    }
  }
}

export default new CourseService();
