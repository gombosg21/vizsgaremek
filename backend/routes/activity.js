const activityController = require("../controllers/activity");
const auth = require("../middlewares/authentiaction/auth");
const router = require('express').Router();

//get user activity
router.get(auth.isAuth, activityController.getActivity);

//sub notifications
router.post(auth.isAuth, activityController.subNotify)

//unsub notifiactions
router.delete(auth.isAuth, activityController.unSubNotify);

module.exports = router;