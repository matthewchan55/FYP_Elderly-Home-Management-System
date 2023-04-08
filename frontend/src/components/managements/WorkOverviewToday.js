import { Grid, Typography, Box, Stack, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import { Controls } from "../controls/Controls";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import AddIcon from "@mui/icons-material/Add";

const WorkOverviewToday = ({ defaultData, nonDefaultData, resData }) => {
  const [todayDefaultWorkList, setTodayDefaultWorkList] = useState(defaultData);
  const [todayCompletedWorkList, setTodayCompletedWorkList] =
    useState(nonDefaultData);
  const [residentList, setResidentList] = useState(resData);

  const [categoryCount, setCategoryCount] = useState();
  const [nonSpecialCategoryCount, setNonSpecialCategoryCount] = useState();
  const today = new Date();

  useEffect(() => {
    const result = getCategoryTitleAndCount(defaultData);
    setCategoryCount(result);
    const resultns = getCategoryTitleAndCount(nonDefaultData);
    setNonSpecialCategoryCount(resultns);
  }, []);

  // create category and item column
  function getCategoryTitleAndCount(data) {
    const result = data.reduce((acc, item) => {
      const category = item.routineCategory;
      const height = item.routineComplete.length * 45;
      if (!acc[category]) {
        acc[category] = { routineCategory: category, count: 0, height: 0 };
      }
      acc[category].count++;
      acc[category].height += height;
      return acc;
    }, {});
    return Object.values(result);
  }

  function findRes(id) {
    const result =
      residentList && residentList.find((d) => d.residentID === id);
    return `${result.lastName}, ${result.firstName}`;
  }
  function findResBed(id) {
    const result =
      residentList && residentList.find((d) => d.residentID === id);
    return `Bed: ${result.room}-${result.bed}`;
  }

  function getDate() {
    return `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`;
  }

  console.log(nonSpecialCategoryCount, todayCompletedWorkList);
  return (
    <>
      {/* Default Routine */}
      <Grid container gap={8}>
        <Grid item xs={6} md={5.5}>
          <Grid container>
            {/* Routine Title*/}
            <Grid item md={2} xs={12}>
              <Box
                pb={2.3}
                display="flex"
                justifyContent={"center"}
                border={"1px solid grey"}
              >
                <Controls.Bold variant="h5">{getDate()}</Controls.Bold>
              </Box>
              {categoryCount &&
                categoryCount.map((c) => (
                  <Box
                    border="1px solid grey"
                    height={c.height}
                    bgcolor="#607d8b"
                    key={c.routineCategory}
                    sx={{ display: { xs: "none", sm: "none", md: "block" } }}
                  >
                    <Controls.Bold
                      textTransform="capitalize"
                      variant="h6"
                      display="flex"
                      justifyContent={"center"}
                    >
                      {c.routineCategory}
                    </Controls.Bold>
                  </Box>
                ))}
            </Grid>
            {/* Routine Name */}
            <Grid item md={4.5} xs={6}>
              <Box border={"1px solid grey"}>
                <Controls.Bold
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={3.2}
                >
                  Special Needed Routine Items
                </Controls.Bold>
              </Box>

              {todayDefaultWorkList &&
                todayDefaultWorkList.map((item, idx) => (
                  <Box
                    pl={1}
                    border={"1px solid grey"}
                    height={45 * item.routineComplete.length}
                    display={"flex"}
                    alignItems={"center"}
                    key={`1-${idx}`}
                  >
                    <Typography noWrap>{item.routineName}</Typography>
                  </Box>
                ))}
            </Grid>

            <Grid item md={5.5} xs={6}>
              <Grid container>
                <Grid item xs={6} md={8}>
                  <Box border={"1px solid grey"}>
                    <Controls.Bold
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={3.2}
                    >
                      Default Elderly
                    </Controls.Bold>
                  </Box>
                  {todayDefaultWorkList &&
                    residentList &&
                    todayDefaultWorkList.map((item, idx) =>
                      item.routineComplete.map((rc, idx2) => (
                        <Box
                          pl={1}
                          key={`2-${idx}-${idx2}`}
                          border={"1px solid grey"}
                          height={45}
                        >
                          <Typography noWrap>{`${findRes(rc.id)}`}</Typography>
                          <Stack direction="row" gap={1}>
                            <Typography
                              variant="subtitle2"
                              color="#808191"
                              fontStyle={"italic"}
                              noWrap
                            >{`${findResBed(rc.id)},`}</Typography>
                            <Typography
                              variant="subtitle2"
                              color="#808191"
                              fontStyle={"italic"}
                              noWrap
                            >{`Resident ID: ${rc.id}`}</Typography>
                          </Stack>
                        </Box>
                      ))
                    )}
                </Grid>
                <Grid item xs={6} md={4}>
                  <Box border={"1px solid grey"}>
                    <Controls.Bold
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={3.2}
                    >
                      Completed
                    </Controls.Bold>
                  </Box>
                  {todayDefaultWorkList &&
                    todayDefaultWorkList.map((item, idx) =>
                      item.routineComplete.map((rc, idx2) => (
                        <Box
                          pl={1}
                          key={`3-${idx}-${idx2}`}
                          border={"1px solid grey"}
                          height={45}
                          display="flex"
                          justifyContent="center"
                          alignItems={"center"}
                        >
                          {rc.status && (
                            <CheckCircleIcon
                              sx={{ color: "#26a69a", fontSize: 50 }}
                            />
                          )}
                        </Box>
                      ))
                    )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} md={5.5}>
          <Grid container>
            {/* Routine Title*/}
            <Grid item md={2} xs={12}>
              <Box
                pb={2.3}
                display="flex"
                justifyContent={"center"}
                border={"1px solid grey"}
              >
                <Controls.Bold variant="h5">
                  {`${today.getFullYear()}/${
                    today.getMonth() + 1
                  }/${today.getDate()}`}
                </Controls.Bold>
              </Box>
              {nonSpecialCategoryCount &&
                nonSpecialCategoryCount.length > 0 &&
                nonSpecialCategoryCount.map((c) => (
                  <Box
                    border="1px solid grey"
                    height={c.height}
                    key={c.routineCategory}
                    bgcolor="#607d8b"
                    sx={{ display: { xs: "none", sm: "none", md: "block" } }}
                  >
                    <Controls.Bold
                      textTransform="capitalize"
                      variant="h6"
                      display="flex"
                      justifyContent={"center"}
                    >
                      {c.routineCategory}
                    </Controls.Bold>
                  </Box>
                ))}
            </Grid>
            {/* Routine Name */}
            <Grid item md={4.5} xs={6}>
              <Box border={"1px solid grey"}>
                <Controls.Bold
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={3.2}
                >
                  Completed Routine Items
                </Controls.Bold>
              </Box>

              {todayCompletedWorkList.length > 0 &&
                todayCompletedWorkList.map((item, idx) => (
                  <Box
                    pl={1}
                    border={"1px solid grey"}
                    height={45 * item.routineComplete.length}
                    display={"flex"}
                    alignItems={"center"}
                    key={`4-${idx}`}
                  >
                    <Typography noWrap>{item.routineName}</Typography>
                  </Box>
                ))}
            </Grid>

            <Grid item md={5.5} xs={6}>
              <Grid container>
                <Grid item xs={6} md={8}>
                  <Box border={"1px solid grey"}>
                    <Controls.Bold
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={3.2}
                    >
                      Elderly Info
                    </Controls.Bold>
                  </Box>
                  {todayCompletedWorkList.length > 0 &&
                    residentList &&
                    todayCompletedWorkList.map((item, idx) =>
                      item.routineComplete.map((rc, idx2) => (
                        <Box
                          pl={1}
                          key={`5-${idx}-${idx2}`}
                          border={"1px solid grey"}
                          height={45}
                        >
                          {rc.id ? (
                            <>
                              <Typography noWrap>{`${findRes(
                                rc.id
                              )}`}</Typography>
                              <Stack direction="row" gap={1}>
                                <Typography
                                  variant="subtitle2"
                                  color="#808191"
                                  fontStyle={"italic"}
                                  noWrap
                                >{`${findResBed(rc.id)},`}</Typography>
                                <Typography
                                  variant="subtitle2"
                                  color="#808191"
                                  fontStyle={"italic"}
                                  noWrap
                                >{`Resident ID: ${rc.id}`}</Typography>
                              </Stack>
                            </>
                          ) : (
                            <Typography>/</Typography>
                          )}
                        </Box>
                      ))
                    )}
                </Grid>
                <Grid item xs={6} md={4}>
                  <Box border={"1px solid grey"}>
                    <Controls.Bold
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={3.2}
                    >
                      Completed
                    </Controls.Bold>
                  </Box>
                  {todayCompletedWorkList.length > 0 &&
                    todayCompletedWorkList.map((item, idx) =>
                      item.routineComplete.map((rc, idx2) => (
                        <Box
                          pl={1}
                          key={`6-${idx}-${idx2}`}
                          border={"1px solid grey"}
                          height={45}
                          display="flex"
                          justifyContent="center"
                          alignItems={"center"}
                        >
                          {rc.status && (
                            <CheckCircleIcon
                              sx={{ color: "#26a69a", fontSize: 50 }}
                            />
                          )}
                        </Box>
                      ))
                    )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Stack>
            {todayCompletedWorkList && todayCompletedWorkList.length === 0 && (
              <Stack alignItems={"center"} mt={20}>
                <ContentPasteSearchIcon sx={{ fontSize: 100 }} />
                <Controls.Bold variant="h6">No routine found</Controls.Bold>
                <Typography variant="subtitle2">
                  {`No routine records on ${getDate()}`}
                </Typography>
                <Typography variant="subtitle2">
                  Would you like to update today's routine records?
                </Typography>
                <Stack direction="row" mt={2}>
                  <Controls.Buttons
                    text="View routine records"
                    color="neutral"
                    variant="outlined"
                  />
                  <Controls.Buttons
                    startIcon={<AddIcon />}
                    text="Update today's routine records"
                    color="success"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        </Grid>
        {/* Completed Routine */}
      </Grid>
    </>
  );
};

export default WorkOverviewToday;
