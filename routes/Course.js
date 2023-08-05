const express = require("express");
const router = express.Router();

// importing the controllers
const {
  createCourse,
  deleteCourse,
  getAllCourses,
  editCourse,
  getFullCourseDetails
} = require("../controllers/Course");
const {
  createSection,
  deleteSection,
  updateSection,
} = require("../controllers/Section");
const { auth, isAdmin } = require("../middlewares/Auth");
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");


// course routes
router.post("/create-course", auth, isAdmin, createCourse);
router.post("/delete-course", auth, isAdmin, deleteCourse);
router.get("/get-courses", getAllCourses);
router.post("/edit-course", auth, isAdmin, editCourse);
router.post('/get-course-details',getFullCourseDetails)

// section routes
router.post("/create-section", auth, isAdmin, createSection);
router.post("/edit-section", auth, isAdmin, updateSection);
router.post("/delete-section", auth, isAdmin, deleteSection);

// subsection routes
router.post("/create-subSection", auth, isAdmin, createSubSection);
router.post("/edit-subSection", auth, isAdmin, updateSubSection);
router.post("/delete-subSection", auth, isAdmin, deleteSubSection);

module.exports = router;
