import { Grid, Typography, Box, Stack } from "@mui/material";
import { useState, useEffect } from "react";
import { Controls } from "../controls/Controls";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { parseISO, format } from "date-fns";


const WorkOverviewToday = ({ data }) => {
  const [todayWorkList, setTodayWorkList] = useState(data);
  const [categoryCount, setCategoryCount] = useState();
  const shift = ["A", "P", "N"];
  const today = new Date();

  useEffect(() => {
    getCategoryTitleAndCount(data);
  }, []);


  function stringDate(date, f) {
    const dateFormat = "dd-MM-yyyy";
    const dateObj = parseISO(date);
    return format(dateObj, dateFormat);
  }

  function getCategoryTitleAndCount(data) {
    const result = data.reduce((acc, item) => {
      const category = item.routineCategory;
      if (!acc[category]) {
        acc[category] = { routineCategory: category, count: 0 };
      }
      acc[category].count++;
      return acc;
    }, {});

    setCategoryCount(Object.values(result));
  }

  console.log(categoryCount)
  function countComplete(data, field, value, fixedTime) {
    let count = 0;
    let exist = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i][field] === value) {
        count++;
      }
      if (data[i][field] === !value) {
        exist = true;
      }
    }

    if (fixedTime === true && count === 0 && !exist) {
      return "/";
    }
    return count;
  }

  const workCount = (data, field, value, fixedTime, routineTotal) => {
    const result = countComplete(data, field, value, fixedTime);

    if (result === "/") {
      return (
        <Controls.GridBox
          border={"1px solid grey"}
          bgcolor={"#bdbdbd"}
          height="26px"
          flex="0 0 33%"
        />
      );
    }

    if (routineTotal === 1 && value === true) {
      return (
        <Box
          border={"1px solid grey"}
          display="flex"
          justifyContent="center"
          height="26px"
          flex="0 0 33%"
        >
          <CheckCircleIcon sx={{ color: "#26a69a" }} />
        </Box>
      );
    }

    return (
      <Box
        display="flex"
        justifyContent="center"
        flex="0 0 33%"
        border={"1px solid grey"}
      >
        <Typography>{result}</Typography>
      </Box>
    );
  };

  return (
    <>
      <Grid container>
        {/* Routine Title*/}
        <Grid item md={3} xs={12}>
          <Box
            pb={2.3}
            display="flex"
            justifyContent="center"
            alignItems="center"
            border={"1px solid grey"}
          >
           <Controls.Bold variant="h5">
              {`${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`}
            </Controls.Bold>
          </Box>
          {categoryCount &&
            categoryCount.map((c) => (
              <Box
                border="1px solid grey"
                height={26 * c.count}
                bgcolor="#607d8b"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Controls.Bold
                  textAlign="center"
                  textTransform="capitalize"
                  variant="h6"
                >
                  {c.routineCategory}
                </Controls.Bold>
              </Box>
            ))}
        </Grid>
        {/* Routine Name */}
        <Grid item md={3} xs={4}>
          <Box border={"1px solid grey"}>
            <Controls.Bold
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={3.2}
            >
              Routine Items
            </Controls.Bold>
          </Box>

          {todayWorkList &&
            todayWorkList.map((item, idx) => (
              <Box pl={1} border={"1px solid grey"}>
                <Typography key={idx}>{item.routineName}</Typography>
              </Box>
            ))}
        </Grid>
        {/* Routine Not Complete (A,P,N) */}
        <Grid item md={3} xs={4}>
          <Box border="1px solid grey">
            <Controls.Bold display="flex" justifyContent="center">
              Not complete
            </Controls.Bold>
          </Box>

          <Stack direction="row">
            {shift.map((s) => (
              <Box
                display="flex"
                justifyContent="center"
                flex="0 0 33%"
                border={"1px solid grey"}
              >
                <Typography>{s}</Typography>
              </Box>
            ))}
          </Stack>
          {todayWorkList &&
            todayWorkList.map((item, idx) => (
              <Stack direction="row" key={idx}>
                {shift.map((s) =>
                  workCount(
                    item.routineComplete,
                    s,
                    false,
                    item.fixedTime,
                    item.routineTotal
                  )
                )}
              </Stack>
            ))}
        </Grid>
        {/* Routine Complete (A,P,N) */}
        <Grid item md={3} xs={4}>
          <Box border="1px solid grey">
            <Controls.Bold display="flex" justifyContent="center">
              Complete
            </Controls.Bold>
          </Box>

          <Stack direction="row">
            {shift.map((s) => (
              <Box
                display="flex"
                justifyContent="center"
                flex="0 0 33%"
                border={"1px solid grey"}
              >
                <Typography>{s}</Typography>
              </Box>
            ))}
          </Stack>
          {todayWorkList &&
            todayWorkList.map((item, idx) => (
              <Stack direction="row" key={idx}>
                {shift.map((s) =>
                  workCount(
                    item.routineComplete,
                    s,
                    true,
                    item.fixedTime,
                    item.routineTotal
                  )
                )}
              </Stack>
            ))}
        </Grid>
      </Grid>
    </>
  );
};

export default WorkOverviewToday;
