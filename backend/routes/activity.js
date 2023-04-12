const activityController = require("../controllers/activity");
const auth = require("../middlewares/authentiaction/auth");
const router = require('express').Router();

//get user activity
router.get("/activity",auth.isAuth, activityController.getActivity);

//sub notifications
router.post("/notify",auth.isAuth, activityController.subNotify)

//unsub notifiactions
router.delete("/notify",auth.isAuth, activityController.unSubNotify);

module.exports = router;