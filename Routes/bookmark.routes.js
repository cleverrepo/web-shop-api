const express = require("express");
const router = express.Router();
const bookmarkController = require("../Controller/bookmark.contoller.js");


router.post("/", bookmarkController.addBookmark);

router.get("/:userId", bookmarkController.getUserBookmarks);


router.delete("/:id", bookmarkController.deleteBookmark);

module.exports = router;
