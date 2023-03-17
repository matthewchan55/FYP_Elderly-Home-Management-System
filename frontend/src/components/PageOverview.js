import { Box, Stack, Typography } from "@mui/material";

const PageOverview = ({ icon, title, titleValue }) => {
  return (
    <Box
      id="residentchart"
      flex={1}
      display="flex"
      pl={5}
      py={3}
      pb={3}
      gap={8}
      width="90%"
    >
      {title.map((t, idx) => (
        <Stack key={idx}
          sx={{
            width: "25%",
            border: 1,
            borderRadius: "5px",
            borderColor: "#bdbdbd",
            p: 2,
          }}
        >
          {icon[idx]}
          <Typography fontSize={18} color="#808191">
            {title[idx]}
          </Typography>
          <Typography fontSize={24} color="#11142d" fontWeight={700} mt={1}>
            {titleValue[idx]}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
};

export default PageOverview;
