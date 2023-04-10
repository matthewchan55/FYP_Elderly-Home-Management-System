const { parseISO } = require('date-fns');
const { format } = require('date-fns');

const ras_test = {
  sumUpColumns: (obj, field) => {
    let totalCost = 0;
    for (let i = 0; i < obj.length; i++) {
      totalCost += obj[i][field];
    }
    return totalCost;
  },
  calculateBalance: (a, b) => {
    return parseFloat(a - b).toFixed(2);
  },
  stringDate: (date, f) => {
    if (date) {
      const dateFormat = f === "date" ? "dd-MM-yyyy" : "dd-MM-yyyy HH:mm";
      const dateObj = parseISO(date);
      return format(dateObj, dateFormat);
    }

    return "N/A";
  },
  formatDate: (date) => {
    const options = { month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  },
};

module.exports = ras_test;
