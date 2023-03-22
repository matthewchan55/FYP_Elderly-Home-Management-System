const User = require("../models/userModel");
const ResInfo = require("../models/residentInfoModel");
const Facility = require("../models/facility");
const Ras = require("../models/residentAccountSummary")

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
    {...req.body},
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
const fetchResidentAccountSummary = async(req, res) => {
  const ras = await Ras.find(req.query).sort({ residentID: 1 });
  res.status(200).json(ras);
}

// POST ras
const createResidentAccountSummary = async (req, res) => {
  const rasInfo = {...req.body};

  try {
    const ras = await Ras.create(rasInfo);
    res.status(200).json(ras);
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
  deleteResident,
  fetchFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  findBed,
  fetchResidentAccountSummary,
  createResidentAccountSummary
};
