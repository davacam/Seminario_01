const express = require("express");
const authMiddleware = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/authorize");
const formController = require("../controllers/formController");

const router = express.Router();
router.use(authMiddleware);

router.get("/", formController.listForms);
router.post("/", authorizeRoles("ADMIN"), ...formController.createForm);
router.get("/:id", formController.getForm);
router.put("/:id", authorizeRoles("ADMIN"), formController.updateForm);
router.delete("/:id", authorizeRoles("ADMIN"), formController.archiveForm);
router.post(
  "/:id/responses",
  authorizeRoles("ADMIN", "TECHNICIAN", "CLIENT"),
  formController.submitFormResponse
);

module.exports = router;
