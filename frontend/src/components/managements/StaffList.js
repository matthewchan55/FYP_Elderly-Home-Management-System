import { Box, Stack, Button, Typography } from "@mui/material";

import FemaleCaregivers from "../../assets/female_caregivers.png";
import MaleCaregivers from "../../assets/male_caregivers.png";
import FemaleAdmin from "../../assets/female_admin.png";
import MaleAdmin from "../../assets/male_admin.png";
import { useEffect, useState } from "react";

const StaffList = ({data, selected, setSelected}) => {

  return (
    <>
      <Box
        sx={{
          width: 200,
          height: 250,
          p: 3,
          border: "1px solid grey",
          borderRadius: "10px",
          mx: "auto",
        }}
      >
      </Box>

      <Stack maxHeight="40vh" overflow="auto">
        {data &&
          data.map((staff, idx) => (
            <Button
              key={idx}
              variant="text"
              onClick={() => setSelected(staff)}
              sx={{
                minHeight: 50,
                minWidth: 220,
                padding: 0,
                justifyContent: { xs: "center", md: "flex-start" },
                "& .MuiTypography-root": {
                  textTransform: "none",
                  color: "#795548",
                },
              }}
            >
              <Typography noWrap>{`${staff.staffID} | ${
                staff.sex === "Not available" ? "N/A" : staff.sex
              } | ${undefined ? "/" : staff.userType} | ${
                undefined ? "/" : staff.lastName
              }, ${undefined ? "/" : staff.firstName} |`}</Typography>
            </Button>
          ))}
      </Stack>
    </>
  );
};

export default StaffList;
