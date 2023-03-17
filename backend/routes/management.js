const express = require("express");
const {
  fetchStaff,
  deleteStaff,
  fetchResident,
  createResident,
  updateResident,
  deleteResident,
  fetchFacility,
  createFacility,
  updateFacility,
  deleteFacility,
} = require("../controllers/managementController");

const router = express.Router();

// staffManagement
// fetch staffs data
router.get("/staff", fetchStaff);

// delete a staff data
router.delete("/staff/:id", deleteStaff);

// residentManagement
// fetch resident data
router.get("/residents", fetchResident);

// fetch resident data
router.post("/residents", createResident);

// fetch resident data
router.patch("/residents/:id", updateResident);

// fetch resident data
router.delete("/residents/:id", deleteResident);

// facilityManagement
// fetch resident data
router.get("/facility", fetchFacility);

// fetch resident data
router.post("/facility", createFacility);

// fetch resident data
router.patch("/facility/:id", updateFacility);

// fetch resident data
router.delete("/facility/:id", deleteFacility);

module.exports = router;
