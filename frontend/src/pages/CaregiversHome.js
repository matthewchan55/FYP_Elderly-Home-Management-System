import { Grid, Paper, Typography, Stack, Button, Divider } from "@mui/material";
import { Box } from "@mui/system";
import { Controls } from "../components/controls/Controls";
const CaregiversHome = () => {
  return (
    <Grid container>
      <Grid item xs={3} md={3}>
        <Paper>
          <Controls.Bold>Today's Working Area:</Controls.Bold>
          <Controls.Bold>Room: 104, 105, 106</Controls.Bold>
        </Paper>

        <Paper>
          <Typography>Today's Duty</Typography>
          <Typography>Resident 12, 13</Typography>
        </Paper>
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs md>
        <Grid container>
          <Grid item md={7}>
            <Stack>
              <Typography>Name: </Typography>
              <Typography>123</Typography>
              <Typography>123</Typography>
              <Typography>123</Typography>
            </Stack>
          </Grid>
          <Grid item md>
            <Stack direction="row">
              <Button>View routine records for elderly 1</Button>
              <Button>View routine records for elderly 1</Button>
            </Stack>
          </Grid>
        </Grid>

        <Grid container direction="row">
          <Grid item xs={6} md={4}>
            <Typography>Default</Typography>
            <Typography>Routine list</Typography>
            <Typography>1</Typography>
            <Typography>2</Typography>
            <Typography>3</Typography>
            <Typography>Medication List</Typography>
            <Typography>Medication List 1</Typography>
            <Typography>Medication List 2</Typography>
            <Typography>Medication List 3</Typography>
          </Grid>
          <Grid item xs md>
            <Stack direction="row">
              <Box p={20} border={"1px solid black"}>
                <Typography> Cleaning</Typography>
              </Box>
              <Box p={20} border={"1px solid black"}>
                <Typography> Health care</Typography>
              </Box>
            </Stack>
            <Stack direction="row">
              <Box p={19.1} border={"1px solid black"}>
                <Typography> Medication</Typography>
              </Box>
              <Box  p={22.1} border={"1px solid black"}>
                <Typography> Others</Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CaregiversHome;
