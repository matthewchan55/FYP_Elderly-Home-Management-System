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
  findBed,
  createResidentAccountSummary,
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

// update prev and new bed information
router.patch("/facility/bed", findBed);

// fetch resident data
router.post("/facility", createFacility);

// fetch resident data
router.patch("/facility/:id", updateFacility);

// fetch resident data
router.delete("/facility/:id", deleteFacility);

// financialManagement
router.post("/finance/ras", createResidentAccountSummary)


module.exports = router;
