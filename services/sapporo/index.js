// 01ED84Y9CGBBJZNNWVT1N8V2P0 : 01ED84Y9CGBBJZNNWVT1N8V2P0
const express = require("express");
const router = express.Router();
const {
  register,
  update,
  validate,
  approve,
  deny,
  contact,
  getOperatorId,
  sync,
  unsubscribe,
} = require("./controller");

router.post("/user/register", register);
router.post("/user/sync", sync);
router.post("/user/update", update);
router.post("/user/unsubscribe", unsubscribe);
router.post("/operator/validate", validate);
router.get("/approve", approve);
router.get("/deny", deny);
router.get("/contact", contact);
router.get("/operator", getOperatorId);
module.exports = router;
