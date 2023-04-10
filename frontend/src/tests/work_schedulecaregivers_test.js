const schedulecaregiver = {
  getColor: (time) => {
    if (time.slice(10, 19) === "T08:00:00") {
      return "green";
    } else if (time.slice(10, 19) === "T14:00:00") {
      return "";
    } else {
      return "brown";
    }
  },
  getDate: () => {
    const currentDate = new Date().toISOString().slice(0, 10);
    return currentDate;
  },
  gatherEvents: (data) => {
    const workingData = data.filter((item) => item.pastWorkingArea);
    const todayData = data.filter(
      (item) => item.workingArea && item.workingShift
    );

    const pastResult =
      workingData &&
      workingData.map((d) => {
        const result = d.pastWorkingArea.map((item) => {
          const stringRoom = item.pastArea.join(", ");
          const staff = `${d.lastName}, ${d.firstName}`;
          const ent = {
            title: `${staff} - ${stringRoom}`,
            start: item.pastShift,
            backgroundColor: schedulecaregiver.getColor(item.pastShift),
            borderColor: schedulecaregiver.getColor(item.pastShift),
          };
          return ent;
        });
        return result;
      });
    const res = pastResult.reduce((acc, curr) => [...acc, ...curr], []);

    const todayResult =
      todayData &&
      todayData.map((d) => {
        const stringRoom = d.workingArea.join(", ");
        const staff = `${d.lastName}, ${d.firstName}`;
        const ent = {
          title: `${staff} - ${stringRoom}`,
          start: d.workingShift,
          backgroundColor: schedulecaregiver.getColor(d.workingShift),
          borderColor: schedulecaregiver.getColor(d.workingShift),
        };
        return ent;
      });
    return res.concat(todayResult)
  },
};


module.exports = schedulecaregiver