const generateResume = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Working bro",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateResume };
