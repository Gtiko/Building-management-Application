const auth = require("../middleware/auth");
const HousingController = require("../controllers/HousingController")

const express = require("express");
const router = express.Router();

// router.use(auth.authenticateToken);


router.get("/login/admin",auth.validateAdmin);

router.get("/", HousingController.getAllImages);

router.get("/emails", HousingController.getRequestedEmail);
router.post("/emails", HousingController.saveVisitRequest);
router.delete("/emails/:email", HousingController.removeRequest);

router.get("/login/admin", auth.authenticateToken );
router.get("/login/admin/addUser",auth.validateAdmin);

router.get("/login/abcd", auth.validateAdmin);

router.use("/login/auth", auth.authLogin);

router.post("/login/admin/addNewUser", auth.validateAdmin, auth.authAddUser, HousingController.addNewUser);

router.patch("/login/admin/updateUser/:userId", auth.validateAdmin, auth.authEmailUpdate, HousingController.updateUser);

router.get("/login/admin/allUsers", HousingController.getAllUsers);

router.get("/login/admin/allProperty", HousingController.getAllProperty);

router.delete("/login/admin/deleteUser/:userId",auth.validateAdmin, HousingController.deleteUser);

// router.p
module.exports = router;
