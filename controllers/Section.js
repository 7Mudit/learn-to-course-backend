const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const mongoose = require('mongoose')

// tested with postman

// create the section
exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({name: sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
			courseId,
			{
				$push: {
					sections: newSection._id,
				},
			},
			{ new: true }
		)
			.populate({
				path: "sections",
				populate: {
					path: "subSections",
				},
			})
			.exec();

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// edit the section
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { $set: { name: sectionName } },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    const course = await Course.findById(courseId)
      .populate({
        path: "sections",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section updated successfully.",
      section,
      data: course,
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// DELETE a section
exports.deleteSection = async (req, res) => {
    try {
      const { sectionId, courseId } = req.body;
  
      if (!sectionId || !courseId) {
        return res.status(400).json({
          success: false,
          message: "Section ID and Course ID are required",
        });
      }
  
      const section = await Section.findById(sectionId);
  
      if (!section) {
        return res.status(404).json({
          success: false,
          message: "Section not Found",
        });
      }
  
      //remove section from course
      await Course.findByIdAndUpdate(courseId, {
        $pull: {
          sections: new mongoose.Types.ObjectId(sectionId),
        },
      });
  
      //delete sub section
      await SubSection.deleteMany({ _id: { $in: section.subSections } });
  
      //delete section
      await Section.findByIdAndDelete(sectionId);
  
      //find the updated course and return
      const course = await Course.findById(courseId)
        .populate({
          path: "sections",
          populate: {
            path: "subSections",
          },
        })
        .exec();
  
      res.status(200).json({
        success: true,
        message: "Section deleted",
        data: course,
      });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
};
  
