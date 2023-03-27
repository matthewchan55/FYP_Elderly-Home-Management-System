import { Box, Stack, Button, Typography, Icon } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FemaleElderly2 from "../../assets/female_elderly2.png";
import MaleElderly2 from "../../assets/male_elderly2.png";

const ResidentList = ({ data, eld, setEld }) => {
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
        {/*  check out MUI Card component */}
        {eld && eld.sex === "F" ? (
          <img
            key={"f"}
            src={FemaleElderly2}
            alt="Female"
            width="150"
            height="200"
          />
        ) : (
          <img
            key={"m"}
            src={MaleElderly2}
            alt="Male"
            width="150"
            height="200"
          />
        )}
      </Box>

      <Stack maxHeight="40vh" overflow="auto">
        {data &&
          data.map((el, idx) => (
            <Button
              key={idx}
              variant="text"
              onClick={() => setEld(el)}
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
              {/*  Change to differnt types of Icon
                done routine, dont medication, paid? ....
              */}
              {/* <Icon >
                <CheckCircleIcon sx={{color: "#26a69a", mb:2, mr:2}}/>
              </Icon> */}
              <Typography noWrap>{`${el.room}-${el.bed} | ${
                el.sex === "Not available" ? "N/A" : el.sex
              } | ${el.age} | ${el.lastName}, ${el.firstName}`}</Typography>
            </Button>
          ))}
      </Stack>
    </>
  );
};

export default ResidentList;
