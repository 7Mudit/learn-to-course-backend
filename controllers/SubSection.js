const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSubSection = async (req, res) => {
  try {
    const { heading, content, sectionId } = req.body;

    if (!heading || !content  || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Given section does not exist",
      });
    }

    // now validation has been done

    // creating a new subsection
    const newSubSection = await SubSection.create({
      heading,
      content,
    });

    // updating existing section push subsection inside section array
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          subSections: newSubSection._id,
        },
      },
      { new: true }
    )
      .populate("subSections")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Created a new subsection and returning updated course details",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, heading, content } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(400).json({
        success: false,
        message: "SubSection does not exist",
      });
    }
    if (heading !== undefined) {
      subSection.heading = heading;
    }
    if (content !== undefined) {
      subSection.content = content;
    }

    // saving the updated document in the database
    await subSection.save();

    // return the updated section
    const section = await Section.findById(sectionId).populate("subSections").exec();

    return res.status(200).json({
      success: true,
      message: "Updated subsection successfully",
      data: section,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          subSections: subSectionId,
        },
      },
      { new: true }
    ).populate("subSections");

    // pulled the subsection id out of section now delete the subsection
    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "SubSection deleted",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
