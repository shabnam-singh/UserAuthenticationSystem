const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUser,
  signInUser,
  getUserById
} = require("../controllers/addUserController");

router.route("/").get(getAllUser).post(createUser);
router.post("/signin", signInUser);
router.get("/:id", getUserById);


module.exports = router;
