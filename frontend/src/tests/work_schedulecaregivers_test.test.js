const schedulecg = require("./work_schedulecaregivers_test");

test('getColor:  ""', () => {
  expect(schedulecg.getColor("T08:00:00")).toMatch("green");
});
test("getColor: green", () => {
  expect(schedulecg.getColor("T14:00:00")).toMatch("");
});
test("getColor:  brown", () => {
  expect(schedulecg.getColor("T15:00:00")).toMatch("brown");
});

test("getDate: only date", () => {
  expect(schedulecg.getDate("2023-04-05T18:00:00")).toMatch("2023-04-05");
});
test("getDate: datetime is wrong", () => {
  expect(schedulecg.getDate("2023-04-05T18:00:00")).not.toMatch(
    "2023-04-05T18:00:00"
  );
});

test("gather events correctly - 1: no, 2: 2, 3: 1", () => {
  const data = [
    {
      //not in the list
      pastWorkingArea: [],
      workingArea: [],
      workingShift: "",
      _id: "63fa1bfe48743bff9f4c8a88",
      account: "dummy32",
      password: "$2b$10$HLv5xQbTvu0SU8kSZALt1OfiuaUFB23jIcdQ0sTb6l2zU/egvOMSe",
      userType: "admin",
      lastName: "C",
      firstName: "ASD",
      staffID: 5,
      address: "hERE",
      phoneNum: "456345",
      sex: "M",
      HKID: "Y86056156",
      createdAt: "2023-02-25T14:32:30.654Z",
      updatedAt: "2023-03-25T17:42:06.513Z",
      __v: 0,
      email: "123@!gmail.com",
      active: true,
      updatedBy: "matthewchan01 (Lam, Tai Man)",
    },
    // in the list two times
    {
      pastWorkingAreaTime: [],
      _id: "63f9e5d93d44875d4d745700",
      account: "dummy22",
      password: "$2b$10$OwKJdWlAibtKF4kyoh.aseGnqfy4c1aKeFXNlkinqEiEHsdpIKmsu",
      userType: "caregivers",
      staffID: 1,
      createdAt: "2023-02-25T10:41:29.431Z",
      updatedAt: "2023-04-10T09:00:34.927Z",
      __v: 0,
      HKID: "Y8406456",
      address: "Hello",
      firstName: "Grid now",
      lastName: "Chan",
      phoneNum: "6846848",
      sex: "F",
      email: "yaofinally@gmail.com",
      active: true,
      updatedBy: "matthewchan01 (Lam, Tai Man)",
      present: false,
      workingArea: ["101", "103", "105"],
      workingShift: "2023-04-10T08:00:00",
      pastWorkingArea: [
        {
          pastArea: ["201", "202", "203"],
          pastShift: "2023-04-09T22:00:00",
        },
      ],
    },
    {
      pastWorkingAreaTime: [],
      workingArea: ["102", "104"],
      workingShift: "2023-04-10T014:00:00",
      _id: "6408970cc73f02b996df9556",
      account: "dummy38",
      password: "$2b$10$XEAruFCiZV2u4ggFYpZckeKnmlGQzUZs4rrT1MGdD0ZxCHzdE1KLe",
      userType: "caregivers",
      lastName: "asd",
      staffID: 20,
      active: true,
      address: "Kwun Tong",
      email: "matthew.ctn56@gmail.com",
      phoneNum: "13212312",
      sex: "F",
      HKID: "Y6106106",
      updatedBy: "matthewchan01 (Lam, Tai Man)",
      createdAt: "2023-03-08T14:09:16.742Z",
      updatedAt: "2023-04-09T10:21:07.030Z",
      __v: 0,
      firstName: "c",
      present: false,
    },
  ];
  const result = [
    {
        "title": "Chan, Grid now - 201, 202, 203",
        "start": "2023-04-09T22:00:00",
        "backgroundColor": "brown",
        "borderColor": "brown"
    },
    {
        "title": "Chan, Grid now - 101, 103, 105",
        "start": "2023-04-10T08:00:00",
        "backgroundColor": "green",
        "borderColor": "green"
    },
    {
        "title": "asd, c - 102, 104",
        "start": "2023-04-10T014:00:00",
        "backgroundColor": "",
        "borderColor": ""
    }


  ]
  expect(schedulecg.gatherEvents(data)).toEqual(result)

  
});
