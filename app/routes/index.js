const router = require("express").Router();
const cors = require("cors");
router.use(cors());
router.use("/auth", require("./login"));
router.use("/table", require("./table"));
router.use("/game", require("./game"));

module.exports = router
