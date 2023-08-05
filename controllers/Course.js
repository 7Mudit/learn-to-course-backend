const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

// tested them with postman everything is working as expected

// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id;

    // Get all required fields from request body
    console.log(req.body)
    let { courseName } = req.body;
    console.log(courseName)

    // Check if any of the required fields are missing
    if (!courseName) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    // Create a new course with the given details
    const newCourse = await Course.create({
      name: courseName,
    });
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// edit the course
exports.editCourse = async(req, res) => {
  try{
    const { courseName , courseId} = req.body;

    if(!courseName || !courseId){
      return res.status(400).json({
        success : false,
        message : "Need all fields"
      })
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId , {
      $set: {
        name : courseName  // the property name should match the schema
      }
    }, {new : true})
    .populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    })
    .exec()

    if(updatedCourse){
      return res.status(200).json({
        success : true,
        message : "Succesfully updated the course details",
        data : updatedCourse
      })
    } else {
      return res.status(404).json({
        success : false,
        message  :"Not found the course with that id"
      })
    }
  } catch(error){
    console.log(error)
    return res.status(500).json({
      success : false,
      message : "Internal server error"
    })
  }
}


// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({})    
    .populate({
      path: "sections",
      populate: {
        path: "subSections",
      },
    })
    .exec()
    if (!allCourses) {
      return res.status(404).json({
        success: false,
        message: "Please add a course",
      });
    }

    return res.status(200).json({
      success: true,
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    });
  }
};

// get course Details
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "sections",
        populate: {
          path: "subSections",
        },
      })
      .exec()

 


    return res.status(200).json({
      success: true,
      data: courseDetails
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Delete the Course

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete sections and sub-sections

    const courseSections = course.sections;

    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSections;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
