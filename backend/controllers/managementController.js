const User = require("../models/userModel");
const ResInfo = require("../models/residentInfoModel");
const Facility = require("../models/facility");
const Ras = require("../models/residentAccountSummary");
const ServiceCost = require("../models/serviceCostModel");
const TodayWorkRecords = require("../models/todayWorkRecord");
const Routine = require("../models/routineModel");
const Medication = require("../models/medicationModel");
const Activity = require("../models/activityModel");
const Calendar = require("../models/calendarModel");
const Diet = require("../models/dietModel");
const Gallery = require("../models/galleryModel");
const Note = require("../models/noteModel");
const Notice = require("../models/noticeModel");

const mongoose = require("mongoose");

// StaffManagement

// fetch staffs data
const fetchStaff = async (req, res) => {
  const staffs = await User.find()
    .or([{ userType: "admin" }, { userType: "caregivers" }])
    .sort({ staffID: 1 });
  res.status(200).json(staffs);
};

// delete staff
const deleteStaff = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such staff" });
  }

  const staff = await User.findOneAndDelete({ _id: id });

  if (!staff) {
    return res.status(404).json({ error: "No such staff" });
  }
  res.status(200).json(staff);
};

// ResidentsManagement

// fetch residentsInfo data
const fetchResident = async (req, res) => {
  const resInfo = await ResInfo.find(req.query).sort({ residentID: 1 });
  res.status(200).json(resInfo);
};

// create residentsInfo data
const createResident = async (req, res) => {
  const resInfo = { ...req.body };

  try {
    const resident = await ResInfo.checkCreateResident(resInfo);
    res.status(200).json(resident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateResident = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such resident" });
  }

  const updatedResident = await ResInfo.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedResident) {
    return res.status(404).json({ error: "No such resident" });
  }
  res.status(200).json(updatedResident);
};

// UPDATE routine (add)
const updateResident_Add = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such resident" });
  }

  const updatedResident = await ResInfo.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { ...req.body },
    },
    { new: true }
  );

  if (!updatedResident) {
    return res.status(404).json({ error: "No such resident" });
  }
  res.status(200).json(updatedResident);
};

// UPDATE routine (del)
const updateResident_Del = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such resident" });
  }

  const updatedResident = await ResInfo.findOneAndUpdate(
    { _id: id },
    {
      $pull: { ...req.body },
    },
    { new: true }
  );

  if (!updatedResident) {
    return res.status(404).json({ error: "No such resident" });
  }
  res.status(200).json(updatedResident);
};

const deleteResident = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such resident" });
  }

  const resident = await ResInfo.findOneAndDelete({ _id: id });

  if (!resident) {
    return res.status(404).json({ error: "No such resident" });
  }
  res.status(200).json(resident);
};

// Facility management
const fetchFacility = async (req, res) => {
  const facility = await Facility.find(req.query).sort({ roomFloor: 1 });
  res.status(200).json(facility);
};

// find bed and update
const findBed = async (req, res) => {
  const bed = await Facility.findOneAndUpdate(
    req.query,
    { ...req.body },
    {
      new: true,
    }
  );
  res.status(200).json(bed);
};

// create a bunch of facilities
const createFacility = async (req, res) => {
  const facilityInfoArray = req.body;

  try {
    const facilities = await Promise.all(
      facilityInfoArray.map(async (facilityInfo) => {
        const facility = await Facility.create(facilityInfo);
        return facility;
      })
    );
    res.status(200).json(facilities);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFacility = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such facility" });
  }

  const updatedFacility = await Facility.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedFacility) {
    return res.status(404).json({ error: "No such facility" });
  }
  res.status(200).json(updatedFacility);
};

const deleteFacility = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such facility" });
  }

  const facility = await Facility.findOneAndDelete({ _id: id });

  if (!facility) {
    return res.status(404).json({ error: "No such facility" });
  }
  res.status(200).json(facility);
};

// Financial Management

// GET ras
const fetchResidentAccountSummary = async (req, res) => {
  const ras = await Ras.find(req.query).sort({ residentID: 1 });
  res.status(200).json(ras);
};

// POST ras
const createResidentAccountSummary = async (req, res) => {
  const rasInfo = { ...req.body };

  try {
    const ras = await Ras.create(rasInfo);
    res.status(200).json(ras);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH ras
const updateResidentAccountSummary = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such resident account summary" });
  }

  const updatedRas = await Ras.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedRas) {
    return res.status(404).json({ error: "No such resident account summary" });
  }
  res.status(200).json(updatedRas);
};

// GET servicecost
const fetchServiceCost = async (req, res) => {
  const sc = await ServiceCost.find(req.query).sort({ serviceCategory: 1 });
  res.status(200).json(sc);
};

// POST servicecost
const createServiceCost = async (req, res) => {
  const serviceCost = { ...req.body };

  try {
    const sc = await ServiceCost.create(serviceCost);
    res.status(200).json(sc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH servicecost
const updateServiceCost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such service cost" });
  }

  const updatedSc = await ServiceCost.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedSc) {
    return res.status(404).json({ error: "No such service cost" });
  }
  res.status(200).json(updatedSc);
};

// DELETE servicecost
const deleteServiceCost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such service cost" });
  }

  const sc = await ServiceCost.findOneAndDelete({ _id: id });

  if (!sc) {
    return res.status(404).json({ error: "No such service cost" });
  }
  res.status(200).json(sc);
};

// Work management

// CREATE todayworkrecords
const createTodayWork = async (req, res) => {
  const todayWorkArray = req.body;

  try {
    const todayWorks = await Promise.all(
      todayWorkArray.map(async (work) => {
        const todayWork = await TodayWorkRecords.create(work);
        return todayWork;
      })
    );
    res.status(200).json(todayWorks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const fetchAllTodayWork = async(req, res) => {
  try {
    const tw = await TodayWorkRecords.find().sort({
      routinePerformer: 1,
      routineCategory: 1,
    });
    res.status(200).json(tw);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// GET todayworkrecords
const fetchTodayWork = async (req, res) => {
  const today = new Date();

  try {
    const tw = await TodayWorkRecords.find({
      routineDate: {
        $gte: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ),
        $lt: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1
        ),
      }
    }).sort({
      routinePerformer: 1,
      routineCategory: 1,
    });

    res.status(200).json(tw);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// CREATE routine
const createRoutine = async (req, res) => {
  const routineArray = req.body;

  try {
    const routines = await Promise.all(
      routineArray.map(async (routine) => {
        const rt = await Routine.create(routine);
        return rt;
      })
    );
    res.status(200).json(routines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET routine
const fetchRoutine = async (req, res) => {
  const routines = await Routine.find(req.query).sort({ routineCategory: 1 });
  res.status(200).json(routines);
};

// UPDATE routine
const updateRoutine = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such routine" });
  }

  const updatedRoutine = await Routine.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedRoutine) {
    return res.status(404).json({ error: "No such routine" });
  }
  res.status(200).json(updatedRoutine);
};

// UPDATE routine (add)
const updateRoutine_Add = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such routine" });
  }

  const updatedRoutine = await Routine.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { ...req.body },
    },
    { new: true }
  );

  if (!updatedRoutine) {
    return res.status(404).json({ error: "No such routine" });
  }
  res.status(200).json(updatedRoutine);
};

// UPDATE routine (del)
const updateRoutine_Del = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such routine" });
  }

  const updatedRoutine = await Routine.findOneAndUpdate(
    { _id: id },
    {
      $pull: { ...req.body },
    },
    { new: true }
  );

  if (!updatedRoutine) {
    return res.status(404).json({ error: "No such routine" });
  }
  res.status(200).json(updatedRoutine);
};

// Medication management

// CREATE med
const createMed = async (req, res) => {
  const medArray = req.body;

  try {
    const meds = await Promise.all(
      medArray.map(async (medicine) => {
        const med = await Medication.create(medicine);
        return med;
      })
    );
    res.status(200).json(meds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET med
const fetchMed = async (req, res) => {
  const med = await Medication.find(req.query).sort({ genericName: 1 });
  res.status(200).json(med);
};


// Activity Management

// GET activity

const fetchActivity = async (req, res) => {
  const ac = await Activity.find(req.query).sort({ startDate: -1 });
  res.status(200).json(ac);
};

// POST activity
const createActivity = async (req, res) => {
  const activityInfo = { ...req.body };

  try {
    const act = await Activity.create(activityInfo);
    res.status(200).json(act);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PATCH activity
const updateActivity = async(req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such activity" });
  }

  const updatedAc = await Activity.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!updatedAc) {
    return res.status(404).json({ error: "No such activity" });
  }
  res.status(200).json(updatedAc);
}


// DELETE activity
const deleteActivity = async(req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such activity" });
  }

  const ac = await Activity.findOneAndDelete({ _id: id });

  if (!ac) {
    return res.status(404).json({ error: "No such activity" });
  }
  res.status(200).json(ac);
}



const createCalendar = async (req, res) => {
  const calendarInfo = { ...req.body };

  try {
    const calendar = await Calendar.create(calendarInfo);
    res.status(200).json(calendar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createDiet = async (req, res) => {
  const dietInfo = { ...req.body };

  try {
    const diet = await Diet.create(dietInfo);
    res.status(200).json(diet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const createGallery = async (req, res) => {
  const galleryInfo = { ...req.body };

  try {
    const ga = await Gallery.create(galleryInfo);
    res.status(200).json(ga);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const createNote = async (req, res) => {
  const noteInfo = { ...req.body };

  try {
    const note = await Note.create(noteInfo);
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const createNotice = async (req, res) => {
  const noticeInfo = { ...req.body };

  try {
    const notice = await Notice.create(noticeInfo);
    res.status(200).json(notice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  fetchStaff,
  deleteStaff,
  fetchResident,
  createResident,
  updateResident,
  updateResident_Add,
  updateResident_Del,
  deleteResident,
  fetchFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  findBed,
  fetchResidentAccountSummary,
  createResidentAccountSummary,
  updateResidentAccountSummary,
  createServiceCost,
  fetchServiceCost,
  updateServiceCost,
  deleteServiceCost,
  createTodayWork,
  fetchAllTodayWork,
  fetchTodayWork,
  createRoutine,
  fetchRoutine,
  updateRoutine,
  updateRoutine_Add,
  updateRoutine_Del,
  createMed,
  fetchMed,
  fetchActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  createCalendar,
  createDiet,
  createGallery,
  createNote,
  createNotice,
};
