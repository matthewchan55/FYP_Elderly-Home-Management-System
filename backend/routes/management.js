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
  createServiceCost,
  fetchServiceCost,
  updateResidentAccountSummary,
  updateServiceCost,
  deleteServiceCost,
  createTodayWork,
  fetchTodayWork,
  createRoutine,
  fetchRoutine,
  fetchMed,
  createMed,
  createActivity,
  createCalendar,
  createDiet,
  createGallery,
  createNote,
  createNotice,
  updateRoutine_Add,
  updateRoutine_Del,
  updateRoutine,
  updateResident_Add,
  updateResident_Del,
  fetchAllTodayWork,
  fetchActivity,
  updateActivity,
  deleteActivity,
  fetchTodayMedication,
  fetchAllMedicationRecords,
  createTodayMedication
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
router.patch("/residents/routineAdd/:id", updateResident_Add)
router.patch("/residents/routineDel/:id", updateResident_Del)

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
router.get("/finance/ras", fetchResidentAccountSummary);
router.post("/finance/ras", createResidentAccountSummary);
router.patch("/finance/ras/:id", updateResidentAccountSummary)

// 2. Service cost
router.get("/finance/servicecost", fetchServiceCost)
router.post("/finance/servicecost", createServiceCost)
router.patch("/finance/servicecost/:id", updateServiceCost)
router.delete("/finance/servicecost/:id", deleteServiceCost)


//WorkManagement

//1. TodayWorkRecords
router.post("/work/todayworkrecords", createTodayWork)
router.get("/work/todayworkrecords", fetchTodayWork)
router.get("/work/allworkrecords", fetchAllTodayWork)

//2. Routine
router.post("/work/routine", createRoutine)
router.get("/work/routine", fetchRoutine)
router.patch("/work/routine/:id", updateRoutine)
router.patch("/work/routine/updateAdd/:id", updateRoutine_Add)
router.patch("/work/routine/updateDel/:id", updateRoutine_Del)

//MedicationManagement

//1. Medication records
router.post("/medication/todaymedicationrecords", createTodayMedication)
router.get("/medication/todaymedicationrecords", fetchTodayMedication)
router.get("/medication/allmedicationrecords", fetchAllMedicationRecords)

//2. Medicine management
router.post("/medication", createMed)
router.get("/medication", fetchMed)

//ActivityManagement
router.get("/activity", fetchActivity)
router.post("/activity", createActivity)
router.patch("/activity/:id", updateActivity)
router.delete("/activity/:id", deleteActivity)

//Others
router.post("/calendar", createCalendar)
router.post("/diet", createDiet)
router.post("/gallery", createGallery)
router.post("/note", createNote)
router.post("/notice", createNotice)

module.exports = router;
