const { generateResume } = require("../controllers/resume");

const router = require("express").Router();
router.use("/api/ping", (_, res) => {
  res.send("Pong");
});
router.post("/api/resume", generateResume);
router.use("/", (req, res, next) => {
  try {
    res.render("index");
  } catch (error) {
    next(error);
  }
});
module.exports = router;
