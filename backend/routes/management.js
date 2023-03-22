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
  fetchResidentAccountSummary,
} = require("../controllers/managementController");

const router = express.Router();

// StaffManagement
// fetch staffs data
router.get("/staff", fetchStaff);

// delete a staff data
router.delete("/staff/:id", deleteStaff);

// ResidentManagement
// fetch resident data
router.get("/residents", fetchResident);

// fetch resident data
router.post("/residents", createResident);

// fetch resident data
router.patch("/residents/:id", updateResident);

// fetch resident data
router.delete("/residents/:id", deleteResident);

// FacilityManagement
// fetch facility data
router.get("/facility", fetchFacility);

// update prev and new bed information
router.patch("/facility/bed", findBed);

// post facility data
router.post("/facility", createFacility);

// update facility data
router.patch("/facility/:id", updateFacility);

// delete facility data
router.delete("/facility/:id", deleteFacility);

// FinancialManagement
// 1. Ras
// fetch ras data
router.get("/finance/ras", fetchResidentAccountSummary);
// post ras data
router.post("/finance/ras", createResidentAccountSummary);

module.exports = router;
